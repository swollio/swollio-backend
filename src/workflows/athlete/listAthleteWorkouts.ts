import db from "../../utilities/database"
import Workout from "../../schema/workout"

/**
 * This workflow gets all the workouts for an athlete.
 * @param athleteId The id of the athlete we want the workouts of
 * @param date The date of the workouts
 */
export default async function listAthleteWorkouts(
    athleteId: number,
    date: string
): Promise<Workout[]> {
    try {
        let workouts
        if (date === "today") {
            workouts = await db["workouts.filter_by_athlete_today"]([athleteId])
        } else {
            workouts = await db["workouts.filter_by_athlete"]([athleteId])
        }
        return workouts.rows as Workout[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `List Athlete Workouts Error: Could not list workouts for athlete ${athleteId}`
        )
    }
}
