import db from "../../utilities/database"
import TeamTag from "../../schema/teamTag"

/**
 * Gets all team_tags for a team of the given id
 * @param teamId The id of the team to get the tags of
 */
export default async function getAllTeamTags(
    teamId: number
): Promise<TeamTag[]> {
    try {
        const teamTags = await db["tags.get_all_team_tags"]([teamId])
        return teamTags.rows as TeamTag[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `getAllTeamTags Error: Could not get tags for team ${teamId}`
        )
    }
}
