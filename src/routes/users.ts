import express from "express"
import requirePermission from "../middleware/auth"
import getCurrentUser from "../workflows/users/getCurrentUser"

const router = express.Router()
router.use(requirePermission([]))

/**
 * This route calls the getCurrentUser workflow, which gets all
 * the relevant data for a user with the given id and returns it.
 */
router.get("/:id", async (req, res) => {
    const userId = Number.parseInt(req.params.id, 10)

    try {
        const currentUser = await getCurrentUser(userId)
        return res.status(200).send(currentUser)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

export default router
