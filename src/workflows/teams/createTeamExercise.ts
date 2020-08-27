import db from "../../utilities/database"
import Exercise from "../../schema/exercise"
import Muscle from "../../schema/muscle"

/**
 * This workflow creates a custom exercise for a team by first adding the
 * exercise to the table and then adding the muscles to the exercise_muscles
 * table
 */
export default async function createTeamExercise(
    teamId: number,
    customExercise: Exercise
): Promise<number> {
    let exerciseId: number

    // First try to add the custom exercise to the exercise table
    try {
        const exercise = await db["exercises.add_custom_exercise"]([
            customExercise.name.toLowerCase(),
            teamId,
        ])

        exerciseId = exercise.rows[0].id
    } catch (err) {
        console.log(err)
        throw new Error(
            `createTeamExercise Error: Could not add custom exercise`
        )
    }

    // Next, try to add the respective muscle groups to the muscles_exercise table
    try {
        await db["exercises.add_muscles_exercises"]([
            customExercise.muscles.map((m: Muscle) => [m.id, exerciseId]),
        ])
    } catch (err) {
        console.log(err)
        throw new Error(
            `createTeamExercise Error: Could not add muscles to muscles_exercise table`
        )
    }

    return exerciseId
}
