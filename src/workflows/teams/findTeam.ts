import db from "../../utilities/database"
import Team from "../../schema/team"

/**
 * This workflow finds a team with the given id and returns it
 * @param teamId The id of the team to find
 */
export default async function findTeam(teamId: number): Promise<Team> {
    try {
        const team = await db["teams.filter_by_id"]([teamId])

        // If nothing was found, then return an empty list
        if (team.rowCount === 0)
            throw new Error(
                `findTeam Error: There is no team with id ${teamId}`
            )

        return team.rows[0] as Team
    } catch (err) {
        console.log(err)
        throw new Error(
            `findTeams Error: Could not find team with id ${teamId}`
        )
    }
}
