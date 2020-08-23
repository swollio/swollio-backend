import Workout from "../../schema/workout"
import * as WorkoutModel from "../../models/workout"

/**
 * This workflow will get all the workouts for a team using
 * the given teamId
 * @param teamId The id of the team that to get the workouts of
 */
export default async function getTeamWorkouts(
    teamId: number
): Promise<Workout[]> {
    try {
        return WorkoutModel.all(teamId)
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamWorkouts Error: Could not get team workouts for team ${teamId}`
        )
    }
}
