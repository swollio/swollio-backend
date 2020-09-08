import express from "express"
import { Validator } from "jsonschema"
import login from "../workflows/auth/login"
import UserData from "../schema/userData"
import signup from "../workflows/auth/signup"

const router = express.Router()
const validator = new Validator()

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
        const token = await login(email.toLowerCase(), password)
        return res.status(200).send(token)
    } catch (err) {
        return res.status(401).send({
            error: {
                status: 401,
                message: err.message,
            },
        })
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
    if (
        !validator.validate(req.body, {
            type: "object",
            properties: {
                first_name: { type: "string", minLength: 1 },
                last_name: { type: "string", minLength: 1 },
                email: {
                    type: "string",
                    pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$",
                },
                password: { type: "string", minLength: 1 },
            },
            additionalProperties: false,
        }).valid
    ) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid user information",
            },
        })
    }
    const user = req.body as UserData

    // Trying to sign up
    try {
        const token = await signup({...user, email: user.email.toLowerCase()})
        return res.status(200).send(token)
    } catch (err) {
        console.log(err)

        return res.status(401).send({
            error: {
                status: 401,
                message: err.message,
            },
        })
    }
})

export default router
