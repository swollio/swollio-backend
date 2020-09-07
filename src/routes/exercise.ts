import express from "express"
import { pool } from "../utilities/database"
import ExerciseModel from "../models/exercise"

const router = express.Router()

/**
 * This route calls the getExercises workflow, which will either
 * return all the exercises or find all the exercises with the given
 * exercise name. The exercise name will be passed in via the query string
 * as a search parameter: URL/exercises?search=<name>
 */
router.get("/", async (req, res) => {
    const query = (req.query.search as string)?.toLowerCase()

    const client = await pool.connect()
    const Exercises = new ExerciseModel(client)
    try {
        const exercises = await Exercises.search(query || "")
        console.log(exercises)
        return res.status(200).send(exercises)
    } catch (err) {
        console.log(err)
        return res.status(200).send(err.message)
    } finally {
        client.release()
    }
})

/**
 * This route calls the findExercise workflow, which gets
 * the exercise with the id that is passed into the
 * request parameters.
 */
router.get("/:id", async (req, res) => {
    const exerciseId = Number.parseInt(req.params.id, 10)

    const client = await pool.connect()
    const Exercises = new ExerciseModel(client)
    try {
        const exercise = await Exercises.readOne(exerciseId)
        return res.status(200).send(exercise)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } finally {
        client.release()
    }
})

/**
 * This route calls the findSimilarExercises workflow, which gets
 * a list of similar exercises to the one whose id was passed in
 * to the request parameters.
 */
router.get("/:id/similar", async (req, res) => {
    const exerciseId = Number.parseInt(req.params.id, 10)

    const client = await pool.connect()
    const Exercises = new ExerciseModel(client)
    try {
        const similar = await Exercises.similar(exerciseId)
        return res.status(200).send(similar)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } finally {
        client.release()
    }
})

export default router
