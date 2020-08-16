import express from "express"
import login from "../workflows/auth/login"
import UserData from "../schema/userData"
import signup from "../workflows/auth/signup"

const router = express.Router()

/**
 * This route will call the login workflow, which will take the
 * steps necessary to log the user in. Our response will send the
 * bearer token for the user after they have been logged in. The body
 * will contain the following:
 * {
 *  - email: string
 *  - password: string
 * }
 */
router.post("/login", async (req, res) => {
    // Getting user data to pass into function
    const { email, password } = req.body

    // Try to login
    try {
        const token = await login(email, password)
        return res.status(200).send(token)
    } catch (err) {
        console.log(err)
        return res.status(403).send(err.message)
    }
})

/**
 * This route will call the signup workflow, which will take the steps
 * necessary to create a new user in the users table. The response will
 * send the user a new bearer token after they have been added and logged in.
 * The body will contain the following:
 * {
 *  - email: string
 *  - password: string
 *  - first_name: string
 *  - last_name: string
 * }
 */
router.post("/signup", async (req, res) => {
    // Formatting body data
    const user = req.body as UserData

    // Trying to sign up
    try {
        const token = await signup(user)
        return res.status(200).send(token)
    } catch (err) {
        console.log(err)
        return res.status(403).send(err.message)
    }
})

export default router
