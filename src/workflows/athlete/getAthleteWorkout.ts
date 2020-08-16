import db from "../../utilities/database"

interface ExerciseAssignment {
    assignment_id: number
    exercise_id: number
    name: string
    weight_scheme: string
    rep_count: number[]
}

/**
 * Gets the list of exercise assignments for the workout with given id
 * @param workoutId The id of the workout we want the exercise assignments of
 */
export default async function getAthleteWorkout(
    workoutId: number
): Promise<ExerciseAssignment[]> {
    try {
        const workout = await db["assignments.filter_by_workout"]([workoutId])
        return workout.rows as ExerciseAssignment[]
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
