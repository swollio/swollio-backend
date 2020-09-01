import db from "../../utilities/database"
import WorkoutInstance from "../../schema/workoutInstance"

// Defining return types
interface AthleteWorkouts {
    workout_id: string
    date: string
    workouts: WorkoutInstance[]
}

/**
 * This workflow gets all the workouts for an athlete.
 * @param athleteId The id of the athlete we want the workouts of
 * @param date The date of the workouts
 *
 * TODO: Get rid of filter by athlete today and manually check the list of workouts for
 *       workouts that are assigned today
 */
export default async function listAthleteWorkouts(
    athleteId: number,
    date: string
): Promise<WorkoutInstance[] | AthleteWorkouts[]> {
    try {
        if (date === "today") {
            const workouts = await db["workouts.filter_by_athlete_today"]([
                athleteId,
            ])
            return workouts.rows as WorkoutInstance[]
        }

        const workouts = await db["workouts.filter_by_athlete"]([athleteId])
        return workouts.rows as AthleteWorkouts[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `List Athlete Workouts Error: Could not list workouts for athlete ${athleteId}`
        )
    }
}
