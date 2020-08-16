import db from "../../utilities/database"
import CurrentUser from "../../schema/currentUser"

/**
 * This workflow takes the user id and returns a CurrentUser instance
 * with all of the necessary data.
 * @param userId The id of the user we want the information of
 */
export default async function getCurrentUser(
    userId: number
): Promise<CurrentUser> {
    try {
        const currentUser = await db["users.get_current_user"]([userId])

        // If the query is empty, throw an error
        if (currentUser.rowCount === 0)
            throw new Error(
                `getCurrentUser Error: Cannot find users with id ${userId}`
            )

        return currentUser.rows[0] as CurrentUser
    } catch (err) {
        console.log(err)
        throw new Error(
            `getCurrentUser Error: Could not get current user with id ${userId}`
        )
    }
}
