import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import config from "../../config.json"
import UserModel from "../../models/user"
import { pool } from "../../utilities/database"
/**
 * This function goes through the workflow of logging a user into their account.
 * The workflow goes like this:
 *  1) Use the user's email to get their user data from the database.
 *  2) Extract their user id and password hash from the data we received
 *  3) Verify that the password they passed in is the same hashed password as the one we have stored
 *  4) If that is true, then we will return a token with the user id as the payload to the user
 *
 *  @param email The email of the user that is logging in
 *  @param password The user's password to login with
 *
 *  @returns {string} The bearer token that contains the user id in its payload
 */
export default async function login(
    email: string,
    password: string
): Promise<string> {
    // Using the email, try to get the user data from the database
    const client = await pool.connect()
    const Users = new UserModel(client)
    try {
        const user = await Users.readOneByEmail(email)
        if (!user) throw new Error(`User data is null (email invalid)`)

        const userId = user.id // Data to put into the token (payload)
        const { hash } = user // Database hash to verify authentication
        const valid = await bcrypt.compare(password, hash || "") // Boolean to determine if password passed in is valid

        // If the password passed in is not valid, throw an error saying something is wrong
        if (!valid) throw new Error("workflows:auth:login:: Incorrect password")

        // If that isn't the case, then we will create a bearer token encoding the user id and return it
        const token = jwt.sign(
            {
                user_id: userId,
            },
            config.auth.secret,
            { expiresIn: "1 day" }
        )

        // Return the bearer token that we have just signed
        return token

        // Verify that the email is valid / we get actual user data back
    } catch (error) {
        // If there is already a ::, throw the old message. If not, throw the new message
        const colonIndex = error.message.indexOf("::")
        if (colonIndex !== -1) throw new Error(error.message)
        throw new Error(`workflows:auth:login:: ${error.message}`)
    }
}
