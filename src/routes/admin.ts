import express from "express"
import db from "../utilities/database"
import * as constants from "../utilities/constants"
import getUsers from "../workflows/admin/getUsers"

const router = express.Router()
// router.use(requirePermission(['admin']))

router.get("/", (req, res) => {
    res.status(200).send({ hello: "world" })
})

/**
 * Executes the getUsers workflow, and returns an array of users
 */
router.get("/users", async (req, res) => {
    try {
        const users = await getUsers()
        return res.status(200).send(users)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

export default router
