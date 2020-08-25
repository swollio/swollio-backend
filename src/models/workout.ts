import sql from "sql-template-strings"
import { ClientBase } from "pg"
import Workout from "../schema/workout"
import Assignment from "../schema/assignment"

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
            throw new Error(`models:workout:all: ${err.message}`)
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
}
