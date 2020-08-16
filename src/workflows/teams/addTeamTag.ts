import db from "../../utilities/database"

/**
 * This workflow adds a team_tag to the database with
 * the given team_id
 * @param teamId The id of the athlete to add the tag to
 * @param tag The tag that needs to be added
 */
export default async function addAthleteTag(
    teamId: number,
    tag: string
): Promise<number> {
    try {
        const teamTagId = await db["tags.add_team_tag"]([teamId, tag])

        if (teamTagId.rowCount === 0)
            throw new Error(
                `addAthleteTag Error: Could not add athlete tag for team ${teamId}`
            )

        return teamTagId.rows[0] as number
    } catch (err) {
        console.log(err)
        throw new Error(
            `addAthleteTag Error: Could not add tag to team ${teamId}`
        )
    }
}
