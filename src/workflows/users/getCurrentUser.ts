import CurrentUser from "../../schema/currentUser"
import UserModel from "../../models/user"
import { pool } from "../../utilities/database"
/**
 * This workflow takes the user id and returns a CurrentUser instance
 * with all of the necessary data.
 * @param userId The id of the user we want the information of
 */
export default async function getCurrentUser(
    userId: number
): Promise<CurrentUser> {
    const client = await pool.connect()
    const Users = new UserModel(client)
    try {
        const currentUser = await Users.current(userId)

        // Validate currentUser data
        if (!currentUser) throw new Error("currentUser is null")

        return currentUser as CurrentUser
    } catch (error) {
        // If there is already a ::, throw the old message. If not, throw the new message
        const colonIndex = error.message.indexOf("::")
        if (colonIndex !== -1) throw new Error(error.message)
        throw new Error(`workflows:users:getCurrentUser:: ${error.message}`)
    } finally {
        client.release()
    }
}
