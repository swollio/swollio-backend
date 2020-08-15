import db from "../../utilities/database"
import Athlete from "../../schema/athlete"

/**
 * This workflow takes in an athlete id and gets that athlete's
 * data from the athletes table.
 * @param athlete_id The id of the athlete whose data we want
 */
export default async function findAthlete(
    athlete_id: number
): Promise<Athlete> {
    // Try to find the athlete and return it
    try {
        const athlete = await db["athletes.filter_by_id"]([athlete_id])
        return athlete.rows[0] as Athlete
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
