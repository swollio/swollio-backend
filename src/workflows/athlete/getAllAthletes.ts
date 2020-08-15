import db from "../../utilities/database"
import Athlete from "../../schema/athlete"

/**
 * This workflow gets all the athletes in a database
 */
export default async function getAllAthletes(): Promise<Athlete[]> {
    try {
        const athletes = await db["athletes.all"]()
        return athletes.rows as Athlete[]
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
