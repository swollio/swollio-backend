import db from "../../utilities/database"
import UserAthlete from "../../schema/userAthlete"

/**
 * This workflow gets all of the athletes for a given team
 * @param teamId The id of the team to get the athletes for
 */
export default async function getTeamAthletes(
    teamId: number
): Promise<UserAthlete[]> {
    try {
        const athletes = await db["athletes.filter_by_team"]([teamId])
        return athletes.rows as UserAthlete[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamAthletes Error: Could not get athletes for team ${teamId}`
        )
    }
}
