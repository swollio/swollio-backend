import sql from "sql-template-strings"
import { Client } from "pg"
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
    client: Client

    constructor(client: Client) {
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

    async create(teamId: number, workout: Workout): Promise<Workout> {
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

    async update(workout: {
        id: number
        name?: string
        dates?: string[]
        assignments?: Assignment[]
    }): Promise<Workout> {
        const updatedAssignments = workout.assignments
            ? workout.assignments.filter((a) => a.id)
            : []
        const createdAssignments = workout.assignments
            ? workout.assignments.filter((a) => !a.id)
            : []

        const workoutId = workout.id
        const name = workout.name ? `'${workout.name}'` : "NULL"
        const dates = workout.dates
            ? `ARRAY[${workout.dates
                  .map((d) => `'${d}'`)
                  .join(", ")}]::timestamp[]`
            : "NULL"

        /**
         * updated_assignment_table is a temporary table that contains all
         * updated assignments.
         */
        const updatedAssignmentTable = updatedAssignments.length
            ? `SELECT 
            column1 as id,
            column2 as workout_id,
            column3 as exercise_id,
            column4 as rep_count
        FROM (
            VALUES 
            ${updatedAssignments
                .map((assignment) => {
                    const assignmentId = assignment.id
                    const repCountString = assignment.rep_count
                        .map((reps) => reps.toString())
                        .join(",")
                    return `(${assignmentId}, ${workout.id}, ${assignment.exercise.id}, ARRAY[${repCountString}]::integer[])`
                })
                .join(",")}
        ) AS _
        `
            : `SELECT
            id,
            workout_id,
            exercise_id,
            rep_count 
        FROM assignments
        WHERE 1 = 0`

        /**
         * created_assignment_table creates a list of assignments and returns their ids.
         */
        const createdAssignmentTable = createdAssignments.length
            ? `SELECT 
            column1 as workout_id,
            column2 as exercise_id,
            column3 as rep_count
        FROM (
            VALUES 
                ${createdAssignments
                    .map((assignment) => {
                        const repCountString = assignment.rep_count
                            .map((reps) => reps.toString())
                            .join(",")
                        return `(${workout.id}, ${assignment.exercise.id}, ARRAY[${repCountString}]::integer[])`
                    })
                    .join(",")}
        ) AS _
        `
            : `SELECT
            workout_id,
            exercise_id,
            rep_count 
        FROM assignments
        WHERE 1 = 0`

        try {
            const result = await this.client.query(sql`

        WITH updated_assignments AS (
            ${updatedAssignmentTable}
        ), created_assignments AS (
            ${createdAssignmentTable}
        ), 
        
        update_workout AS (
            UPDATE workouts SET
                name = COALESCE(${name}, name),
                dates = COALESCE(${dates}, dates)
            WHERE id = ${workoutId}
            RETURNING id, name, dates
        ),
        
        delete_assignments AS (
            DELETE FROM assignments
            WHERE workout_id = ${workoutId}
            AND id NOT IN (SELECT id FROM updated_assignments)
        ),
        
        create_assignments AS (
            INSERT INTO assignments (workout_id, exercise_id, rep_count)
                SELECT * FROM created_assignments
            RETURNING id
        ),

        update_assignments AS (
            INSERT INTO assignments (id, workout_id, exercise_id, rep_count)
                SELECT * FROM updated_assignments
            ON CONFLICT (id)
            DO UPDATE SET
                exercise_id = excluded.exercise_id,
                rep_count = excluded.rep_count
        )

        SELECT 
            id, name, dates, 
            (SELECT ARRAY_AGG(ROW_TO_JSON(create_assignments)) FROM create_assignments) as assignments
        FROM update_workout;
    `)

            console.log(result.rows[0])
            return result.rows[0]
        } catch (err) {
            throw new Error("models:workout:update: invalid query")
        }
    }
}
