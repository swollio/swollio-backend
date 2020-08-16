import db from "../../utilities/database"
import User from "../../schema/user"

/**
 * This function executes the getUsers workflow and returns a list of all the users in
 * the database, following the schema provided by the User interface
 */
export default async function getUsers(): Promise<User[]> {
    try {
        const users = await db["users.list"]()
        return users.rows as User[]
    } catch (err) {
        console.log(err)
        throw new Error("Get Users Error: Could not get all users")
    }
}
