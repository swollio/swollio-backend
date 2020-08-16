import db from "../../utilities/database"
import TeamTag from "../../schema/teamTag"

/**
 * This workflow gets all the tags for a given athlete on
 * a given team.
 * @param athleteId The id of the athlete to get the tags of
 * @param teamId the id of the team to get the tags of
 */
export default async function getAllAthleteTags(
    athleteId: number,
    teamId: number
): Promise<TeamTag[]> {
    try {
        const tags = await db["tags.get_athlete_tags"]([athleteId, teamId])
        return tags.rows as TeamTag[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `Could not find tags for athlete ${athleteId} on team ${teamId}`
        )
    }
}
