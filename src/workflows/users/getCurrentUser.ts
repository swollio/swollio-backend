import CurrentUser from "../../schema/currentUser"
import * as UserModel from "../../models/user"

/**
 * This workflow takes the user id and returns a CurrentUser instance
 * with all of the necessary data.
 * @param userId The id of the user we want the information of
 */
export default async function getCurrentUser(
    userId: number
): Promise<CurrentUser> {
    try {
        const currentUser = await UserModel.current(userId)

        // Validate currentUser data
        if (!currentUser) throw new Error("currentUser is null")

        return currentUser as CurrentUser
    } catch (error) {
        throw new Error(`workflows:user:getCurrentUser:: ${error.message}`)
    }
}
