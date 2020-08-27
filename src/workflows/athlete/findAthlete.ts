import { pool } from "../../utilities/database"
import Athlete from "../../schema/athlete"
import AthleteModel from "../../models/athlete"

/**
 * This workflow takes in an athlete id and gets that athlete's
 * data from the athletes table.
 * @param athleteId The id of the athlete whose data we want
 */
export default async function findAthlete(athleteId: number): Promise<Athlete> {
    // Try to find the athlete and return it
    const client = await pool.connect()
    const Athletes = new AthleteModel(client)
    try {
        const athlete = await Athletes.readOne(athleteId)
        if (!athlete) throw new Error("No athlete with given id")

        return athlete
    } catch (error) {
        // If there is already a ::, throw the old message. If not, throw the new message
        const colonIndex = error.message.indexOf("::")
        if (colonIndex !== -1) throw new Error(error.message)
        throw new Error(`workflows:athlete:findAthlete:: ${error.message}`)
    } finally {
        client.release()
    }
}
