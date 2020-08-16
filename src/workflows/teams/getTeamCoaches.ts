import db from "../../utilities/database"
import Coach from "../../schema/coach"

/**
 * This workflow gets all the coaches for a team with the given id
 * @param teamId The id of the team to get the coaches for
 */
export default async function getTeamCoaches(teamId: number): Promise<Coach[]> {
    try {
        const coaches = await db["teams.all_coaches"]([teamId])
        return coaches.rows as Coach[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamCoaches Error: Cannot find the coaches for team ${teamId}`
        )
    }
}
