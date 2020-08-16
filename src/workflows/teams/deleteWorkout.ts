import db from "../../utilities/database"

/**
 * This workflow deletes the given athlete id from the given team
 * @param teamId The id of the team from which we should delete the athlete
 * @param athleteId The id of the athlete which we should delete
 */
export default async function deleteWorkout(
    teamId: number,
    workoutId: number
): Promise<void> {
    try {
        await db["workout.remove_one"]([workoutId])
    } catch (err) {
        console.log(err)
        throw new Error(
            `deleteWorkout Error: Could not remove workout ${workoutId} from team ${teamId}`
        )
    }
}
