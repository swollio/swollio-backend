import db from "../../utilities/database"

/**
 * This workflow adds a tag to an athlete on a given team
 *
 * @param athleteId The id of the athlete to add the tag to
 * @param teamTagId The id of the team's tag that to add to the athlete
 */
export default async function addAthleteTag(
    athleteId: number,
    teamTagId: number
): Promise<void> {
    try {
        await db["tags.add_athlete_tag"]([athleteId, teamTagId])
    } catch (err) {
        console.log(err)
        throw new Error(
            `addAthleteTag Error: Could not add tag to athlete ${athleteId} on team ${teamTagId}`
        )
    }
}
