import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import db from "../../utilities/database"
import config from "../../config.json"
import User from "../../schema/user"

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
    let user
    try {
        const userData = await db["users.login"]([email])

        // Verify that the email is valid / we get actual user data back
        if (userData.rowCount === 0)
            throw new Error("Login Error: Incorrect email")

        // Get the actual user object from the data
        user = userData.rows[0] as User
    } catch (err) {
        console.log(err)
        throw new Error("Login Error: Cannot get user data. Check email.")
    }

    const userId = user.id // Data to put into the token (payload)
    const { hash } = user // Database hash to verify authentication
    const valid = bcrypt.compare(hash, password) // Boolean to determine if password passed in is valid

    // If the password passed in is not valid, throw an error saying something is wrong
    if (!valid) throw new Error("Login Error: Incorrect email or password")

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
}
