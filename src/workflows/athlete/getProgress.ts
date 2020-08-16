import db from "../../utilities/database"

interface WorkoutStats {
    exercise_name: string
    exercise_id: number
    weight_series: number[] // what type is this?
}

export default async function getAthleteProgress(
    athleteId: number
): Promise<WorkoutStats[]> {
    try {
        const results = await db["statistics.weight_by_exercise"]([athleteId])
        return results.rows as WorkoutStats[]
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
