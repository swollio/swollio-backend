import db from "../../utilities/database"
import Exercise from "../../schema/exercise"

/**
 * This workflow will get an exercise with the given id from the
 * database and return it.
 *
 * @param exerciseId The id of the exercise to get
 */
export default async function findExercise(
    exerciseId: number
): Promise<Exercise> {
    try {
        const exercise = await db["exercises.filter_by_id"]([exerciseId])
        return exercise.rows[0] as Exercise
    } catch (err) {
        console.log(err)
        throw new Error(
            `findExercise Error: Could not find the exercise with id ${exerciseId}`
        )
    }
}
