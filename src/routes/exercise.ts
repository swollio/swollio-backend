import express from "express"
import getExercises from "../workflows/exercise/getExercises"
import findExercise from "../workflows/exercise/findExercise"
import findSimilarExercises from "../workflows/exercise/findSimilarExercise"

const router = express.Router()

/**
 * This route calls the getExercises workflow, which will either
 * return all the exercises or find all the exercises with the given
 * exercise name. The exercise name will be passed in via the query string
 * as a search parameter: URL/exercises?search=<name>
 */
router.get("/", async (req, res) => {
    const exerciseName = (req.query.search as string)?.toLowerCase()

    try {
        const exercises = await getExercises(exerciseName)
        return res.status(200).send(exercises)
    } catch (err) {
        console.log(err)
        return res.status(200).send(err.message)
    }
})

/**
 * This route calls the findExercise workflow, which gets
 * the exercise with the id that is passed into the
 * request parameters.
 */
router.get("/:id", async (req, res) => {
    const exerciseId = Number.parseInt(req.params.id, 10)

    try {
        const exercise = await findExercise(exerciseId)
        return res.status(200).send(exercise)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the findSimilarExercises workflow, which gets
 * a list of similar exercises to the one whose id was passed in
 * to the request parameters.
 */
router.get("/:id/similar", async (req, res) => {
    const exerciseId = Number.parseInt(req.params.id, 10)

    try {
        const similarExercises = await findSimilarExercises(exerciseId)
        return res.status(200).send(similarExercises)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

export default router
