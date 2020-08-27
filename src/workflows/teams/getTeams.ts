import db from "../../utilities/database"
import Team from "../../schema/team"

/**
 * This workflow gets all of the teams in the database and
 * returns them as an array. This workflow should only be
 * accessible to admins.
 */
export default async function getTeams(): Promise<Team[]> {
    try {
        const teams = await db["teams.all"]()
        return teams.rows as Team[]
    } catch (err) {
        console.log(err)
        throw new Error("getTeams Error: Could not get all teams.")
    }
}
