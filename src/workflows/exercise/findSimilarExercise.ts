import db from "../../utilities/database"
import SimilarExercise from "../../schema/similarExercise"

/**
 * This workflow finds a similar exercise to the exercise
 * which has the id that was passed in
 */
export default async function findSimilarExercises(
    exerciseId: number
): Promise<SimilarExercise[]> {
    try {
        const exercises = await db["exercises.filter_by_similar"]([exerciseId])
        return exercises.rows as SimilarExercise[]
    } catch (err) {
        console.log(err)
        throw new Error(`Could not find the exercise with id ${exerciseId}`)
    }
}
