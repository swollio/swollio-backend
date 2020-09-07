import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import config from "../../config.json"
import UserData from "../../schema/userData"
import UserModel from "../../models/user"
import { pool } from "../../utilities/database"
/**
 * This workflow will take the steps necessary to sign a user up. The workflow will go as follows:
 *  1) We encrypt the password that was passed in
 *  2) We put all the user's information (and the encrypted password) into the database
 *  3) We store the new user id that we get back
 *  4) We create a bearer token with this id as the payload and send it to the user
 *  5) Return the bearer token
 * @param user An object containing the data of the user that is signing up
 */
export default async function signup(userData: UserData): Promise<string> {
    // Encrypt / hash the password:
    let hash
    try {
        hash = await bcrypt.hash(userData.password, 10)
    } catch (error) {
        throw new Error("workflows:auth:signup:: Could not create the hash")
    }

    // Checking validity of hash
    if (!hash || hash === "")
        throw new Error("workflows:auth:signup Unable to get hash")

    // Add the user to the database
    const client = await pool.connect()
    const Users = new UserModel(client)
    try {
        const user = await Users.createOne({
            ...userData,
            hash,
        })

        // Genereate the bearer token and return it
        const token = jwt.sign(
            {
                user_id: user.id,
            },
            config.auth.secret,
            { expiresIn: "1 day" }
        )

        // Return this bearer token
        return token
    } catch (error) {
        throw new Error(`Email address already in use`)
    } finally {
        client.release()
    }
}
