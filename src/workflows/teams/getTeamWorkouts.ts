import db from "../../utilities/database"
import Workout from "../../schema/workout"

/**
 * This workflow will get all the workouts for a team using
 * the given teamId
 * @param teamId The id of the team that to get the workouts of
 */
export default async function getTeamWorkouts(
    teamId: number
): Promise<Workout[]> {
    try {
        const workouts = await db["workouts.filter_by_team"]([teamId])
        return workouts.rows as Workout[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamWorkouts Error: Could not get team workouts for team ${teamId}`
        )
    }
}
