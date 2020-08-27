import db from "../../utilities/database"

/**
 * This workflow deletes the given athlete id from the given team
 * @param teamId The id of the team from which we should delete the athlete
 * @param athleteId The id of the athlete which we should delete
 */
export default async function deleteAthlete(
    teamId: number,
    athleteId: number
): Promise<void> {
    try {
        await db["teams.remove_athlete"]([teamId, athleteId])
    } catch (err) {
        console.log(err)
        throw new Error(
            `deleteAthlete Error: Could not remove athlete ${athleteId} from team ${teamId}`
        )
    }
}
