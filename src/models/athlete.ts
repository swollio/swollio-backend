import sql from "sql-template-strings"
import { ClientBase } from "pg"
import Athlete from "../schema/athlete"
import Team from "../schema/team"

export interface AthleteRow {
    id: number
    user_id: number
    age: number
    height: number
    weight: number
    gender: string
}

export default class AthleteModel {
    client: ClientBase

    constructor(client: ClientBase) {
        this.client = client
    }

    /**
     * Creates an athlete using the data passed in, and returns the same athlete along with the
     * athlete id.
     *
     * @precondition The athlete that is passed in is conforms to the TypeScript interface
     * @param athlete The data to insert into the athletes table
     * @returns {Promise<Athlete>} The athlete that was passed in with the new athlete id appended to the object
     */
    async createOne(athlete: Athlete): Promise<Athlete> {
        try {
            const athleteResult = await this.client.query(sql`
            INSERT INTO athletes (user_id, age, height, weight, gender)
            VALUES (${athlete.user_id}, ${athlete.age}, ${athlete.height}, ${athlete.weight}, ${athlete.gender})
            RETURNING id, user_id, age, height, weight, gender;
        `)

            return athleteResult.rows[0]
        } catch (error) {
            throw new Error(`models:athlete:createOne:: ${error.message}`)
        }
    }

    /**
     * Gets the athlete from the database with the given athlete id. If no
     * athlete has the given id, return null
     *
     * @param athleteId The id of the athlete to get from the database
     * @returns {Promise<Athlete | null>} The athlete with the given id or null if no such athlete exists
     */
    async readOne(athleteId: number): Promise<Athlete | null> {
        try {
            const athleteResult = await this.client.query(sql`
            SELECT id, user_id, age, height, weight, gender
            FROM athletes WHERE id = ${athleteId};
        `)

            // Verifying athlete data
            if (athleteResult.rowCount === 0) return null

            return athleteResult.rows[0]
        } catch (error) {
            throw new Error(`models:athlete:createOne:: ${error.message}`)
        }
    }

    async updateOne(athlete: {
        id: number
        age?: number
        height?: number
        weight?: number
        gender?: string
    }): Promise<void> {
        try {
            // If the key is defined, then return 'value', else return null
            const athleteId = athlete.id
            const ageUpdate = athlete.age
            const heightUpdate = athlete.height
            const weightUpdate = athlete.weight
            const genderUpdate = athlete.gender

            await this.client.query(sql`
            UPDATE athletes
            SET
                age = COALESCE(${ageUpdate}, age),
                height = COALESCE(${heightUpdate}, height),
                weight = COALESCE(${weightUpdate}, weight),
                gender = COALESCE(${genderUpdate}, gender)
            WHERE id = ${athleteId}
        `)
        } catch (error) {
            throw new Error(`models:athlete:update:: ${error.message}`)
        }
    }

    /**
     * Deletes the athlete with the given id from the athletes table. The user
     * remains untouched.
     *
     * @param id The id of the athlete to delete
     */
    async destroyOne(athleteId: number): Promise<void> {
        try {
            await this.client.query(sql`
                DELETE FROM athletes
                WHERE id=${athleteId}
            `)
        } catch (error) {
            throw new Error(`models:athlete:delete:: ${error.message}`)
        }
    }
}
