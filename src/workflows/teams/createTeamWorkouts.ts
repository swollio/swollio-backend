import { pool } from "../../utilities/database"
import Workout from "../../schema/workout"
import WorkoutModel from "../../models/workout"
import FeedModel, { FeedItemKind } from "../../models/feed"
/**
 * This workflow create a workout for a team using the given
 * teamId and workout. To do this, we will first create the workout
 *
 * @param teamId The id of the team that is creating the workout
 * @param workout The workout object containing the data for the workout
 */
export default async function createTeamWorkout(
    teamId: number | null,
    athleteId: number | null,
    workout: Workout
): Promise<void> {
    const client = await pool.connect()
    try {
        const Workouts = new WorkoutModel(client)
        const Feed = new FeedModel(client);

        // Filter out all 0s from workout assignments
        const filteredAssignments = workout.assignments.map((assignment) => ({
            ...assignment,
            rep_count: assignment.rep_count.filter((rep) => rep > 0),
        }))
        const result = await Workouts.createOne(teamId, athleteId, {
            ...workout,
            assignments: filteredAssignments,
        })
        if (athleteId && result.id) {
            await Feed.createOne({
                athlete_id: athleteId,
                kind: FeedItemKind.JoinWorkout,
                extra_data: { workout: {id: result.id, name: result.name}}
            })
        }
    } finally {
        client.release()
    }
}
