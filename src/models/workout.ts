import sql from "sql-template-strings"
import { ClientBase } from "pg"
import Workout from "../schema/workout"
import Assignment from "../schema/assignment"
import WorkoutList from "../schema/workoutList"

/**
 * Schema for `assignments` database
 */
export interface AssignmentRow {
    id: number
    workout_id: number
    exercise_id: number
    rep_count: number[]
}

/**
 * Schema for `workouts` database
 */
export interface WorkoutRow {
    id: number
    team_id: number
    name: string
    dates: string[]
}

/**
 * Schema for `athletes_teams` database
 */
export interface AthleteTeamsRow {
    team_id: number
    athlete_id: number
}

export default class ExerciseModel {
    client: ClientBase

    constructor(client: ClientBase) {
        this.client = client
    }

    /**
     * Return the Workout with the given id if it exists, or `null` otherwise.
     *
     * @param id - the id of the workout to return.
     */
    async readOne(id: number): Promise<Workout | null> {
        try {
            const results = await this.client.query(sql`
            WITH exercises AS (
                SELECT
                    exercises.id,
                    exercises.name,
                    (
                        SELECT COALESCE(
                            ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(muscles))), 
                            '[]'::json
                        ) FROM muscles 
                        INNER JOIN muscles_exercises
                        ON muscle_id = id
                        WHERE exercise_id = exercises.id
                    ) as muscles
                FROM exercises
            ) 
            
            SELECT 
                workouts.id,
                workouts.name,
                workouts.dates,
                (
                    SELECT COALESCE(
                        ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT(
                            'id', assignments.id,
                            'exercise', exercises,
                            'rep_count', assignments.rep_count
                        ))), 
                        '[]'::json
                    ) FROM assignments 
                    INNER JOIN exercises
                        ON assignments.exercise_id = exercises.id
                    WHERE workout_id = workouts.id
                ) as assignments
            FROM workouts
            WHERE workouts.id = ${id}
        `)
            if (results.rows.length === 0) return null
            return results.rows[0]
        } catch (err) {
            throw new Error(`models:workout:one: ${err.message}`)
        }
    }

    async readAllWithTeamId(
        teamId: number,
        pageIndex = 0,
        pageSize = 10
    ): Promise<Workout[]> {
        try {
            const offset = pageIndex * pageSize

            const results = await this.client.query(sql`
            WITH exercises AS (
                SELECT
                    exercises.id,
                    exercises.name,
                    (
                        SELECT COALESCE(
                            ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(muscles))), 
                            '[]'::json
                        ) FROM muscles 
                        INNER JOIN muscles_exercises
                        ON muscle_id = id
                        WHERE exercise_id = exercises.id
                    ) as muscles
                FROM exercises
            ) 
            
            SELECT 
                workouts.id,
                workouts.name,
                workouts.dates,
                (
                    SELECT COALESCE(
                        ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT(
                            'id', assignments.id,
                            'exercise', exercises,
                            'rep_count', assignments.rep_count
                        ))), 
                        '[]'::json
                    ) FROM assignments 
                    INNER JOIN exercises
                        ON assignments.exercise_id = exercises.id
                    WHERE workout_id = workouts.id
                ) as assignments
            FROM workouts
            WHERE workouts.team_id = ${teamId}
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY;
        `)

            return results.rows
        } catch (err) {
            throw new Error(`models:workout:allTeam: ${err.message}`)
        }
    }

    async destroy(id: number): Promise<void> {
        try {
            await this.client.query(sql`
            DELETE FROM workouts WHERE id=${id}
        `)
        } catch (err) {
            throw new Error(`models:workout:remove: ${err.message}`)
        }
    }

    async createOne(teamId: number, workout: Workout): Promise<Workout> {
        const { name } = workout
        const { dates } = workout
        const assignments = JSON.stringify(
            workout.assignments.map((a) => ({
                exercise_id: a.exercise.id,
                rep_count: a.rep_count,
            }))
        )

        try {
            // Start transaction
            await this.client.query("BEGIN")

            // Insert workout into the workouts table
            const workoutResult = await this.client.query(sql`
            INSERT INTO workouts (name, team_id, dates)
            VALUES (${name}, ${teamId}, ${dates}::timestamp[])
            RETURNING id
        `)

            const workoutId = workoutResult.rows[0].id

            // Insert all assignments into the assignments table
            const assignmentResult = await this.client.query(sql`
            INSERT INTO assignments (workout_id, exercise_id, rep_count)
            SELECT ${workoutId}, exercise_id, rep_count FROM 
            JSON_POPULATE_RECORDSET(NULL::assignments, ${assignments})
            RETURNING id
        `)

            // Finish transaction
            await this.client.query("COMMIT")

            return {
                ...workout,
                id: workoutId,
                assignments: workout.assignments.map((assignment, i) => ({
                    id: assignmentResult.rows[i].id,
                    ...assignment,
                })),
            }
        } catch (error) {
            await this.client.query("ROLLBACK")
            throw new Error(
                `models:workout:create: invalid query (${error.message})`
            )
        }
    }

    async updateOne(workout: {
        id: number
        name?: string
        dates?: string[]
        assignments?: Assignment[]
    }): Promise<Workout> {
        try {
            await this.client.query("BEGIN")

            const workoutResult = await this.client.query(sql`
                UPDATE workouts SET
                    name = COALESCE(${workout.name}, name),
                    dates = COALESCE(${workout.dates}, dates)
                WHERE id = ${workout.id}
                RETURNING id, name, dates
            `)

            const updatedWorkout = workoutResult.rows[0] as WorkoutRow

            await this.client.query(sql`
                DELETE FROM assignments WHERE workout_id = ${workout.id}
            `)

            if (workout.assignments) {
                const assignments = JSON.stringify(
                    workout.assignments.map((a) => ({
                        exercise_id: a.exercise.id,
                        rep_count: a.rep_count,
                    }))
                )

                await this.client.query(sql`
                    INSERT INTO assignments (workout_id, exercise_id, rep_count)
                    SELECT ${workout.id}, exercise_id, rep_count FROM 
                    JSON_POPULATE_RECORDSET(NULL::assignments, ${assignments})
                `)
            }

            await this.client.query("COMMIT")

            return {
                name: updatedWorkout.name,
                dates: updatedWorkout.dates,
                assignments: workout.assignments || [],
            }
        } catch (error) {
            await this.client.query("ROLLBACK")
            throw new Error(
                `models:workout:updateOne: invalid query (${error.message})`
            )
        }
    }

    async destroyOne(workoutId: number): Promise<void> {
        try {
            await this.client.query("BEGIN")

            await this.client.query(sql`
                DELETE FROM assignments
                WHERE workout_id=${workoutId}
            `)

            await this.client.query(sql`
                DELETE FROM workouts
                WHERE id=${workoutId}
            `)

            await this.client.query("COMMIT")
        } catch (error) {
            await this.client.query("ROLLBACK")
            throw new Error(
                `models:workout:destroyOne: invalid query (${error.message})`
            )
        }
    }

    async readAllWithAthleteId(
        athleteId: number,
        today = false,
        initIndex = 0,
        initSize = 10
    ): Promise<WorkoutList[]> {
        let pageIndex
        let pageSize

        if (today) {
            pageIndex = 0
            pageSize = 1
        } else {
            pageIndex = initIndex
            pageSize = initSize
        }

        try {
            const offset = pageIndex * pageSize

            const results = await this.client.query(sql`
            WITH exercises AS (
                SELECT
                    exercises.id,
                    exercises.name,
                    (
                        SELECT COALESCE(
                            ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(muscles))), 
                            '[]'::json
                        ) FROM muscles 
                        INNER JOIN muscles_exercises
                        ON muscle_id = id
                        WHERE exercise_id = exercises.id
                    ) as muscles
                FROM exercises
            ), 
            full_workouts AS (
                SELECT 
                    workouts.id,
                    workouts.name,
                    workouts.dates,
                    teams.name as team_name,
                    (
                        SELECT COALESCE(
                            ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT(
                                'id', assignments.id,
                                'exercise', exercises,
                                'rep_count', assignments.rep_count
                            ))), 
                            '[]'::json
                        ) FROM assignments 
                        INNER JOIN exercises
                            ON assignments.exercise_id = exercises.id
                        WHERE workout_id = workouts.id
                    ) as assignments
                FROM workouts
                INNER JOIN athletes_teams
                        ON workouts.team_id = athletes_teams.team_id
                INNER JOIN teams
                        ON workouts.team_id = teams.id
                WHERE athletes_teams.athlete_id = ${athleteId}
            ), 
            full_workouts_unnested AS (
                SELECT id, name, team_name, assignments, unnest(full_workouts.dates) as date
                FROM full_workouts
                ), full_workouts_unnested_completed AS (
                SELECT full_workouts_unnested.*, EXISTS(
                    SELECT 1
                    FROM workout_surveys 
                    WHERE workout_surveys.workout_id = full_workouts_unnested.id 
                    AND due_date = date 
                    AND athlete_id = ${athleteId}
                ) 
                AS completed
                FROM full_workouts_unnested
            ) 
            SELECT date, ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(full_workouts_unnested_completed))) AS workouts
            FROM full_workouts_unnested_completed
            WHERE date >= CURRENT_DATE
            GROUP BY date
            ORDER BY date            
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY;
        `)

            return results.rows
        } catch (err) {
            throw new Error(`models:workout:allAthlete: ${err.message}`)
        }
    }
}
