import { pool } from "../../utilities/database"
import Workout from "../../schema/workout"
import WorkoutModel from "../../models/workout"

/**
 * This workflow create a workout for a team using the given
 * teamId and workout. To do this, we will first create the workout
 *
 * @param teamId The id of the team that is creating the workout
 * @param workout The workout object containing the data for the workout
 */
export default async function createTeamWorkout(
    teamId: number,
    workout: Workout
): Promise<void> {
    const client = await pool.connect()
    const Workouts = new WorkoutModel(client)
    try {
        // Filter out all 0s from workout assignments
        workout.assignments.map((assignment) =>
            assignment.rep_count.filter((rep) => rep > 0)
        )
        console.log("b")
        console.log(workout.assignments)
        if (workout.id) {
            await Workouts.updateOne({
                id: workout.id,
                name: workout.name,
                dates: workout.dates,
                assignments: workout.assignments,
            })
        }
    } finally {
        client.release()
    }

    /*
    // After verification, add the workout to the workouts table
    try {
        const workoutQuery = await db["workouts.insert_one"]([
            teamId,
            workout.name,
            `{${workout.dates.map((x) => `"${x}"`).join(",")}}`,
        ])

        // Store the id of the new workout that was created
        workoutId = workoutQuery.rows[0].id
    } catch (err) {
        console.log(err)
        throw new Error(`createTeamWorkouts Error: Could not create workout`)
    }

    // Now we can add the assignments from workout to the assignments database
    try {
        await db["assignments.insert_many"]([
            workout.assignments.map((assignment) => [
                workoutId,
                assignment.exercise.id,
                `{${assignment.rep_count
                    .map((x) => `"${x.toString()}"`)
                    .join(",")}}`,
            ]),
        ])
    } catch (err) {
        console.log(err)
        throw new Error(
            `createTeamWorkouts Error: Could not add assignments to workout`
        )
    } */
}
