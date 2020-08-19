/**
 * This file contains the database model for workouts.
 * All database specific types and data are fully encapsulated.
 */

import { pool } from "../utilities/database"
import Workout from "../schema/workout"

/**
 * Return the Workout with the given id if it exists, or `null` otherwise.
 *
 * @param id - the id of the workout to return.
 */
export async function one(id: number): Promise<Workout | null> {
    try {
        const results = await pool.query(`
            WITH exercises AS (
                SELECT
                    exercises.id,
                    exercises.name,
                    ARRAY_AGG(ROW_TO_JSON(muscles)) as muscles
                FROM exercises
                INNER JOIN muscles_exercises
                    ON muscles_exercises.exercise_id = exercises.id
                INNER JOIN muscles
                    ON muscles_exercises.muscle_id = muscles.id
                GROUP BY exercises.id
            ) 
            
            SELECT 
                workouts.id,
                workouts.name,
                workouts.dates,
                ARRAY_AGG(
                    JSON_BUILD_OBJECT(
                        'id', assignments.id,
                        'exercise', exercises,
                        'rep_count', assignments.rep_count
                    )
                ) as assignments
            FROM workouts
            INNER JOIN assignments
                ON assignments.workout_id = workouts.id
            INNER JOIN exercises
                ON assignments.exercise_id = exercises.id
            WHERE workouts.id=${id}
            GROUP BY workouts.id;
        `)
        if (results.rows.length === 0) return null
        return results.rows[0]
    } catch (err) {
        throw new Error(`models:workout:one: ${err.message}`)
    }
}

export async function all(pageIndex = 0, pageSize = 10): Promise<Workout[]> {
    try {
        const offset = pageIndex * pageSize

        const results = await pool.query(`
            WITH exercises AS (
                SELECT
                    exercises.id,
                    exercises.name,
                    ARRAY_AGG(ROW_TO_JSON(muscles)) as muscles
                FROM exercises
                INNER JOIN muscles_exercises
                    ON muscles_exercises.exercise_id = exercises.id
                INNER JOIN muscles
                    ON muscles_exercises.muscle_id = muscles.id
                GROUP BY exercises.id
            ) 
            
            SELECT 
                workouts.id,
                workouts.name,
                workouts.dates,
                ARRAY_AGG(
                    JSON_BUILD_OBJECT(
                        'id', assignments.id,
                        'exercise', exercises,
                        'rep_count', assignments.rep_count
                    )
                ) as assignments
            FROM workouts
            INNER JOIN assignments
                ON assignments.workout_id = workouts.id
            INNER JOIN exercises
                ON assignments.exercise_id = exercises.id
            GROUP BY workouts.id
            OFFSET ${offset} ROWS
            FETCH NEXT ${pageSize} ROWS ONLY;
        `)

        return results.rows
    } catch (err) {
        throw new Error(`models:workout:all: ${err.message}`)
    }
}

export async function remove(id: number): Promise<void> {
    try {
        await pool.query(`
            DELETE FROM workouts WHERE id=${id}
        `)
    } catch (err) {
        throw new Error(`models:workout:remove: ${err.message}`)
    }
}

/*
export async function create(workout: Workout): Promise<void> {

    const dates = workout.dates.join(", ");

    try {
        await pool.query(`
            WITH workout AS (
                INSERT INTO workouts (name, team_id)
                VALUES ('${name}', ${team_id})
                RETURNING id
            ), _ AS (
                INSERT INTO muscles_exercises (muscle_id, exercise_id)
                SELECT UNNEST(ARRAY[${muscleIds}]::integer[]), id FROM exercise
            )
            
            SELECT id FROM exercise;
        `)
    } catch (err) {
        throw new Error("models:workout:create: invalid query")
    }
}
*/
/*

export async function update(workout: Workout): Promise<Workout[]> {

    const name = workout.name || 'NULL';

    const dates = workout.dates
                ? workout.dates.map((d) => `'${d}'`).join(', ')
                : 'NULL';

    const assignments = workout.assignments
                        ? workout.assignments.map((a) => serialize_assignment(a)).join(', ')
                        : 'NULL';

    try {
        const result = await pool.query(`
            UPDATE workouts SET
                name = COALESCE(${name}, name),
                dates = COALESCE(${dates}, dates),
                assignments = COALESCE(${assignments}, assignments),
            WHERE id = ${workout.id}
            RETURNING name, date, assignments;
        `);

        return result.rows[0];
    } catch (err) {
        throw new Error('models:workout:remove: invalid query')
    }
} */
