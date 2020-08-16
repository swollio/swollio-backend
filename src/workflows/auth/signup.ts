import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import db from "../../utilities/database"
import config from "../../config.json"
import UserData from "../../schema/userData"

/**
 * This workflow will take the steps necessary to sign a user up. The workflow will go as follows:
 *  1) We encrypt the password that was passed in
 *  2) We put all the user's information (and the encrypted password) into the database
 *  3) We store the new user id that we get back
 *  4) We create a bearer token with this id as the payload and send it to the user
 *  5) Return the bearer token
 * @param user An object containing the data of the user that is signing up
 */
export default async function signup(user: UserData): Promise<string> {
    // Encrypt / hash the password:
    let hash
    try {
        hash = await bcrypt.hash(user.password, 10)
    } catch (err) {
        console.log(err)
        throw new Error("Signup Error: Could not create the hash")
    }

    // Add the user to the database
    let userId
    try {
        const queryResult = await db["users.signup"]([
            user.first_name,
            user.last_name,
            user.email,
            hash,
        ])

        // Getting the user id of the newly inserted user
        userId = queryResult.rows[0].id
    } catch (err) {
        console.log(err)
        throw new Error("Signup Error: Could not add user to database")
    }

    // Genereate the bearer token and return it
    const token = jwt.sign(
        {
            user_id: userId,
        },
        config.auth.secret,
        { expiresIn: "1 day" }
    )

    // Return this bearer token
    return token
}
