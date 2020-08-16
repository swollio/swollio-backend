import db from "../../utilities/database"
import Team from "../../schema/team"
import generatePin from "../../utilities/generatePin"

/**
 * This workflow will add a team to the database and assign it a random,
 * 6 digit, unique pin
 *
 * @param userId The id of the user that is creating the team (coach)
 * @param team The team object that contains the team's data
 */
export default async function createTeam(
    userId: number,
    team: Team
): Promise<void> {
    // Generate a random pin for the team
    const teamPin = generatePin()

    // Try to add the team to the database
    try {
        await db["teams.add_one"]([team.name, team.sport, userId, teamPin])
    } catch (err) {
        console.log(err)
        throw new Error("createTeam Error: Could not create team")
    }
}
