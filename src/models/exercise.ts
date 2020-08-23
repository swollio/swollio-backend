/**
 * This file contains the database model for exercises.
 * All database specific types and data are fully encapsulated.
 */
import { Pool } from "pg"
import Exercise from "../schema/exercise"
import sql from "sql-template-strings"

/**
 * Return a promise resolving to either the Exercise of the given id if it
 * exists or null if it does not.
 *
 * @param id - the id of the exercise
 */
export default class ExerciseModel {
    
    pool: Pool

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async setup(values: Exercise[]): Promise<void> {
        try {

            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS exercises (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    weight INT NOT NULL DEFAULT 2,
                    reps INT NOT NULL DEFAULT 2,
                    legitimacy INT NOT NULL DEFAULT 2,
                    team_id INT DEFAULT NULL REFERENCES teams(id) ON DELETE CASCADE
                );
            `)

            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS muscles (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    nickname TEXT NOT NULL,
                    region TEXT NOT NULL
                );
            `);
            
        } catch (err) {
            throw new Error(`models:exercise:remove: ${err.message}`)
        }
    }

    async one(id: number): Promise<Exercise | null> {
        try {
            const result = await this.pool.query(sql`
                SELECT
                    exercises.id,
                    exercises.name,
                    ARRAY_AGG(ROW_TO_JSON(muscles)) as muscles
                FROM exercises
                INNER JOIN muscles_exercises
                    ON muscles_exercises.exercise_id = exercises.id
                INNER JOIN muscles
                    ON muscles_exercises.muscle_id = muscles.id
                WHERE exercises.id=${id}
                GROUP BY exercises.id;
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
    async all(pageIndex = 0, pageSize = 10): Promise<Exercise[]> {
        try {
            const offset = pageIndex * pageSize

            const result = await this.pool.query(sql`
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
                ORDER BY exercises.id
                OFFSET ${offset} ROWS
                FETCH NEXT ${pageSize} ROWS ONLY;
            `)

            console.log(result.rows)
            
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
    async create(
        team_id: number,
        exercise: Exercise
    ): Promise<Exercise> {
        try {
            const { name } = exercise
            const muscleIds = exercise.muscles.map((m) => m.id).join(", ")

            // This query performs a compound insert of both the exercise itself as
            // well as the muscles worked by the exercise.
            const result = await this.pool.query(sql`
                WITH exercise AS (
                    INSERT INTO exercises (name, team_id)
                    VALUES ('${name}', ${team_id})
                    RETURNING id
                ), _ AS (
                    INSERT INTO muscles_exercises (muscle_id, exercise_id)
                    SELECT UNNEST(ARRAY[${muscleIds}]::integer[]), id FROM exercise
                )
                
                SELECT id FROM exercise;
            `)

            return {
                id: result.rows[0].id,
                ...exercise,
            }
        } catch (err) {
            throw new Error(`models:exercise:create: ${err.message}`)
        }
    }

    /**
     * Return a promise resolving to either the Exercise with the given id if it
     * exists and null if it does not.
     *
     * @param id - the id of the exercise
     */
    async remove(id: number): Promise<void> {
        try {
            await this.pool.query(sql`
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
            const result = await this.pool.query(sql`
                SELECT 
                    exercises.id,
                    exercises.name,
                    ARRAY_AGG(ROW_TO_JSON(muscles)) as muscles
                FROM exercises 
                INNER JOIN muscles_exercises 
                    ON muscles_exercises.exercise_id = exercises.id
                INNER JOIN muscles
                    ON muscles_exercises.muscle_id = muscles.id
                WHERE exercises.name 
                LIKE '%' || '${query}' || '%'
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
            const result = await this.pool.query(sql`
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