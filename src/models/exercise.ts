/**
 * This file contains the database model for exercises.
 * All database specific types and data are fully encapsulated.
 */
import { ClientBase } from "pg"
import sql from "sql-template-strings"
import Exercise from "../schema/exercise"

/**
 * Schema for `muscles` database
 */
export interface MuscleRow {
    id: number
    name: string
    nickname: string
    region: string
}

/**
 * Schema for `muscles_exercises` database
 */
export interface MusclesExerciseRow {
    muscle_id: number
    exercise_id: number
}

/**
 * Schema for `exercises` database
 */
export interface ExerciseRow {
    id: number
    name: string
    team_id: number | null
}

/**
 * Return a promise resolving to either the Exercise of the given id if it
 * exists or null if it does not......
 *
 * @param id - the id of the exercise
 */
export default class ExerciseModel {
    client: ClientBase

    constructor(client: ClientBase) {
        this.client = client
    }

    async readOne(id: number): Promise<Exercise | null> {
        try {
            const result = await this.client.query(sql`
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
                WHERE exercises.id=${id}
            `)

            return result.rows.length === 0 ? null : result.rows[0]
        } catch (err) {
            throw new Error(`models:exercise:all: ${err.message}`)
        }
    }

    /**
     * Return a promise resolving to a list of all exercises. Note that for
     * efficiency, this function is paginated.
     *
     * @param pageIndex - the page index
     * @param pageSize - the page size
     */
    async readAll(pageIndex = 0, pageSize = 10): Promise<Exercise[]> {
        try {
            const offset = pageIndex * pageSize

            const result = await this.client.query(sql`
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
                OFFSET ${offset} ROWS
                FETCH NEXT ${pageSize} ROWS ONLY;
            `)

            return result.rows
        } catch (error) {
            throw new Error("models:exercise:all: invalid query")
        }
    }

    /**
     * Create an Exercise with the given name and team_id and return a promise resolving to
     * the exercise.
     *
     * @param exercise - the exercise to insert into the database
     * @return - a promise resolving to an exercise with an id.
     */
    async createOne(
        teamId: number | null,
        exercise: Exercise
    ): Promise<Exercise> {
        try {
            const { name } = exercise
            const muscleIds = exercise.muscles.map((m) => m.id)

            // Insert workout into the workouts table
            const exerciseResult = await this.client.query(sql`
                INSERT INTO exercises (name, team_id)
                VALUES (${name}, ${teamId})
                RETURNING id
            `)

            const exerciseId = exerciseResult.rows[0].id

            // This query performs a compound insert of both the exercise itself as
            // well as the muscles worked by the exercise.
            await this.client.query(sql`
                INSERT INTO muscles_exercises (muscle_id, exercise_id)
                SELECT muscle_ids.*, ${exerciseId}
                FROM UNNEST(${muscleIds}::integer[]) as muscle_ids
            `)

            await this.client.query("COMMIT")

            return {
                id: exerciseId,
                ...exercise,
            }
        } catch (err) {
            await this.client.query("ROLLBACK")
            throw new Error(`models:exercise:create: ${err.message}`)
        }
    }

    /**
     * Return a promise resolving to either the Exercise with the given id if it
     * exists and null if it does not.
     *
     * @param id - the id of the exercise
     */
    async removeOne(id: number): Promise<void> {
        try {
            await this.client.query(sql`
                DELETE FROM exercises WHERE id=${id}
            `)
        } catch (err) {
            throw new Error(`models:exercise:remove: ${err.message}`)
        }
    }

    /**
     * Search for exercises with a name containing the given query string.
     *
     * @param query - the search term
     * @return - a promise resolving to a list of exercises.
     */
    async search(
        query: string,
        pageIndex = 0,
        pageSize = 10
    ): Promise<Exercise[]> {
        try {
            const offset = pageIndex * pageSize
            const result = await this.client.query(sql`
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
                WHERE exercises.name 
                LIKE '%' || ${query} || '%'
                GROUP BY exercises.id
                OFFSET ${offset} ROWS
                FETCH NEXT ${pageSize} ROWS ONLY
            `)

            return result.rows
        } catch (err) {
            throw new Error(`models:exercise:search: ${err.message}`)
        }
    }

    /**
     * Return a list of at most 5 exercises which work similar muscles to the
     * exercise with the given id.
     *
     * @param id - the exercise id for which to find similar exercises
     * @returns - a promise resolving to a list of similar exercises.
     */
    async similar(
        id: number,
        pageIndex = 0,
        pageSize = 10
    ): Promise<Exercise[]> {
        try {
            const offset = pageIndex * pageSize
            const result = await this.client.query(sql`
                WITH primary_muscles AS (
                    SELECT muscles.id FROM muscles
                    INNER JOIN muscles_exercises 
                        ON muscles_exercises.muscle_id = muscles.id
                    WHERE exercise_id = ${id}
                ), similar_exercises AS (
                    SELECT 
                        exercise_id AS id,
                        COUNT(muscle_id) AS similarity FROM muscles_exercises
                    INNER JOIN primary_muscles
                        ON primary_muscles.id = muscle_id
                    WHERE exercise_id <> ${id}
                    GROUP BY exercise_id
                    ORDER BY similarity DESC
                    OFFSET ${offset} ROWS
                    FETCH NEXT ${pageSize} ROWS ONLY
                )
                
                SELECT
                    exercises.id,
                    exercises.name,
                    ARRAY_AGG(ROW_TO_JSON(muscles)) as muscles
                FROM similar_exercises
                INNER JOIN exercises
                    ON exercises.id = similar_exercises.id
                INNER JOIN muscles_exercises 
                    ON muscles_exercises.exercise_id = exercises.id
                INNER JOIN muscles
                    ON muscles_exercises.muscle_id = muscles.id
                GROUP BY exercises.id
            `)

            return result.rows
        } catch (err) {
            throw new Error(`models:exercise:similar: ${err.message}`)
        }
    }
}
