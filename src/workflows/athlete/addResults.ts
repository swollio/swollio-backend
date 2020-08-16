import db from "../../utilities/database"
import Result from "../../schema/result"

export default async function addResults(
    athleteId: number,
    workoutId: number,
    results: Result[]
): Promise<void> {
    // Data validation check
    if (results.length === 0) return

    try {
        const formattedResults = [
            results.map((result) => [
                athleteId,
                result.exercise_id,
                result.assignment_id,
                workoutId,
                result.date,
                result.weight,
                result.reps,
                result.created,
            ]),
        ]
        await db["results.insert_many"](formattedResults)
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
