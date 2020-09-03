import { pool } from "../../utilities/database"
import WorkoutList from "../../schema/workoutList"
import WorkoutModel from "../../models/workout"

/**
 * This workflow gets the workouts for an athlete.
 * @param athleteId The id of the athlete we want the workouts of
 * @param date The date of the workouts
 *
 * TODO: Get rid of filter by athlete today and manually check the list of workouts for
 *       workouts that are assigned today
 */
export default async function listAthleteWorkouts(
    athleteId: number,
    date: string
): Promise<WorkoutList[]> {
    const client = await pool.connect()
    const Workouts = new WorkoutModel(client)
    try {
        if (date === "today") {
            const workouts = await Workouts.readAllWithAthleteId(
                athleteId,
                true
            )
            console.log(workouts[0].workouts[0].assignments)
            // Returning the first element because this contains the workouts for today
            return [] as WorkoutList[]
        }

        const workouts = await await Workouts.readAllWithAthleteId(athleteId)
        return [] as WorkoutList[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `List Athlete Workouts Error: Could not list workouts for athlete ${athleteId}`
        )
    } finally {
        client.release()
    }
}
