import db from "../../utilities/database"
import Assignment from "../../schema/assignment"

/**
 * This workflow gets a team's assignments using the given workoutId
 * @param workoutId The id of the workout to get
 */
export default async function getTeamWorkout(
    teamId: number,
    workoutId: number
): Promise<Assignment[]> {
    try {
        const assignments = await db["assignments.filter_by_workout"]([
            workoutId,
        ])

        if (assignments.rowCount === 0)
            throw new Error(
                `getTeamWorkout Error: There are no assignments with id ${workoutId}`
            )
        return assignments.rows as Assignment[]
    } catch (err) {
        console.log(err)
        throw new Error(
            `getTeamWorkout Error: Could not get team ${teamId}'s workout`
        )
    }
}
