import { pool } from "../../utilities/database"
import Workout from "../../schema/workout"
import WorkoutModel from "../../models/workout"

/**
 * This workflow will get all the workouts for a team using
 * the given teamId
 * @param teamId The id of the team that to get the workouts of
 */
export default async function getTeamWorkouts(
    teamId: number
): Promise<Workout[]> {
    const client = await pool.connect()
    const Workouts = new WorkoutModel(client)
    try {
        return Workouts.readAllWithTeamId(teamId)
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamWorkouts Error: Could not get team workouts for team ${teamId}`
        )
    } finally {
        client.release()
    }
}
