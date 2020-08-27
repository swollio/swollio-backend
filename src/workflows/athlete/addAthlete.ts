import db, { pool } from "../../utilities/database"
import Athlete from "../../schema/athlete"
import AthleteModel from "../../models/athlete"

/**
 * This workflow creates an athlete, which entails the following:
 *  1) Get the id of the team this athlete is joining (from the pin)
 *  2) Insert the athlete's information into the athlete table and get their id
 *  3) Add this athlete to the athlete_teams table with the new team id
 *
 * @param athleteData The athlete data in the body of the request
 * Athlete Data: {
 *  - age: number
 *  - height: number
 *  - weight: number
 *  - gender: male | female
 *  - pin: number
 * }
 * @param userId The id of the user that is making the request (athlete being added)
 * @param pin The pin of the team that the athlete is being added to
 */
export default async function addAthlete(
    athlete: Athlete,
    pin: number
): Promise<void> {
    const client = await pool.connect()
    const Athletes = new AthleteModel(client)
    try {
        // Try to get the team id of the given pin
        let teamId
        let athleteReturned

        // Verify that pin is valid
        if (pin.toString().length !== 6)
            throw new Error("Pin does not have 6 digits")

        try {
            // Query for the team id
            const teamQuery = await db["teams.get_id_by_pin"]([pin])

            // If there is no id, then throw an error
            if (teamQuery.rowCount === 0)
                throw new Error("There is no team with this pin")

            // Set the team id
            teamId = teamQuery.rows[0].id
        } catch (error) {
            // If there is already a ::, throw the old message. If not, throw the new message
            const colonIndex = error.message.indexOf("::")
            if (colonIndex !== -1) throw new Error(error.message)
            throw new Error(`workflows:athlete:addAthlete:: ${error.message}`)
        }

        // After athlete is verified, try to add the athlete
        try {
            athleteReturned = await Athletes.createOne(athlete)
        } catch (error) {
            // If there is already a ::, throw the old message. If not, throw the new message
            const colonIndex = error.message.indexOf("::")
            if (colonIndex !== -1) throw new Error(error.message)
            throw new Error(`workflows:athlete:addAthlete:: ${error.message}`)
        }

        // After we get the athlete and team ids, try to add the athlete to the team
        try {
            await db["teams.add_athlete"]([teamId, athleteReturned.id])
        } catch (error) {
            // If there is already a ::, throw the old message. If not, throw the new message
            const colonIndex = error.message.indexOf("::")
            if (colonIndex !== -1) throw new Error(error.message)
            throw new Error(`workflows:athlete:addAthlete:: ${error.message}`)
        }
    } finally {
        client.release()
    }
}
