import db from "../../utilities/database"
import Exercise from "../../schema/exercise"

/**
 * This workflow will query the database and either return all exercises
 * from the database, or search for an exercise with the given (optional)
 * exerciseName
 * @param exerciseName (optional) The name of the exercise to search for
 */
export default async function getExercises(
    exerciseName?: string
): Promise<Exercise[]> {
    // If we were provided with an exercise name, use that as our filter
    if (exerciseName) {
        try {
            const exercises = await db["exercises.search_by_name"]([
                exerciseName,
            ])
            return exercises.rows as Exercise[]
        } catch (err) {
            console.log(err)
            throw new Error("getExercise Error: Unable to search by name")
        }
    }

    try {
        const exercises = await db["exercises.all"]()
        return exercises.rows as Exercise[]
    } catch (err) {
        console.log(err)
        throw new Error("getExercise Error: Unable to get all exercises")
    }
}
