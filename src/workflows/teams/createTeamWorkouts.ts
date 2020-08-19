import db from "../../utilities/database"
import Workout from "../../schema/workout"

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
    let workoutId: number

    console.log(workout)

    // Make sure there are assignments in the workout before we add anything
    // to the database
    if (workout.assignments.length === 0)
        throw new Error(
            "createTeamWorkout Error: There are no assignments in this workout"
        )

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
    }
}
