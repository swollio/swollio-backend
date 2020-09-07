import express from "express"
import { Validator } from "jsonschema"
import Athlete from "../schema/athlete"
import requirePermission from "../middleware/auth"
import Result from "../schema/result"
import Survey from "../schema/survey"
import getAllAthletes from "../workflows/athlete/getAllAthletes"
import findAthlete from "../workflows/athlete/findAthlete"
import listAthleteWorkouts from "../workflows/athlete/listAthleteWorkouts"
import getAthleteWorkout from "../workflows/athlete/getAthleteWorkout"
import getAthleteProgress from "../workflows/athlete/getProgress"
import addResults from "../workflows/athlete/addResults"
import addSurvey from "../workflows/athlete/addSurvey"
import { pool } from "../utilities/database"
import AthleteModel from "../models/athlete"

const validator = new Validator()

const router = express.Router()
router.use(requirePermission([]))

/**
 * Return a list of all athletes in the database. This method should only be
 * accessible to admins.
 */
router.get("/", async (_req, res) => {
    try {
        const athletes = await getAllAthletes()
        return res.status(200).send(athletes)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route will add an athlete to the athletes table, and add this athlete to
 * the team that has the pin passed in by the athlete. The body of this request must
 * contain the following:
 * {
 *  - age: number
 *  - height: number
 *  - weight: number
 *  - gender: male | female
 *  - pin: number (of pin in teams table)
 * }
 */
router.post("/", async (req, res) => {
    console.log(req.body)
    if (
        !validator.validate(req.body, {
            type: "object",
            properties: {
                // To ensure that we are following Children's Online Privacy
                // Protection Act (COPPA), we set the minimum for using our app
                // to 13.
                age: { type: "number", minimum: 13 },
                height: { type: "number" },
                weight: { type: "number" },
                gender: { type: ["string", "null"] },
                user_id: { type: "number" },
            },
            additionalProperties: false,
        }).valid
    ) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid athlete information",
            },
        })
    }
    const athlete = req.body as Athlete

    const client = await pool.connect()
    const Athletes = new AthleteModel(client)
    try {
        await Athletes.createOne(athlete)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } finally {
        client.release()
    }
})

/**
 * Calls the find athlete workflow, and returns the athlete with the given id
 */
router.get("/:id", async (req, res) => {
    const athleteId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid id",
            },
        })
    }

    try {
        const athlete = await findAthlete(athleteId)
        return res.status(200).send(athlete)
    } catch (err) {
        return res.status(500).send(err.message)
    }
})

/**
 * Takes in the athlete's id and gets all the workouts
 * for that athlete. This calls the listAthleteWorkouts workflow
 *
 * LOOK OVER THIS AGAIN AND MAKE SURE TYPE IS RIGHT
 */
router.get("/:id/workouts", async (req, res) => {
    const athleteId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid id",
            },
        })
    }

    const workouts = await listAthleteWorkouts(athleteId)
    return res.send(workouts);
})

/**
 * This calls the getAthleteWorkout workflow, which returns a list
 * of exercise assignments for a given workout
 */
router.get("/:id/workouts/:workout_id", async (req, res) => {
    const athleteId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid athlete id",
            },
        })
    }

    const workoutId = Number.parseInt(req.params.workoutId, 10)
    if (Number.isNaN(workoutId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid workout id",
            },
        })
    }

    try {
        const workout = await getAthleteWorkout(workoutId)
        return res.status(200).send(workout)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This calls the getAthleteProgress workflow, which will return
 * all of the athlete's progress in each exercise
 */
router.get("/:id/exercises/", async (req, res) => {
    const athleteId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid id",
            },
        })
    }

    try {
        const results = await getAthleteProgress(athleteId)
        return res.status(200).send(results)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/*
 * Add athlete's workout results. This takes an array of results
 * from individual reps. Results can be sent as soon as the athlete
 * completes a rep, but can also be sent in bulk as an array of results
 * at the end of the workout.
 *
 * Example POST body:
 *
 * [{
 *   assignment_id: 1,
 *   exercise_id: 4,
 *   reps: 10,
 *   weight: 120
 * }, {
 *   assignment_id: 1,
 *   exercise_id: 4,
 *   reps: 8,
 *   weight: 140
 * }, {
 *   assignment_id: 1,
 *   exercise_id: 4,
 *   reps: 6,
 *   weight: 160
 * }]
 */
router.post("/:id/results/:workoutId", async (req, res) => {
    const athleteId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid athlete id",
            },
        })
    }

    const workoutId = Number.parseInt(req.params.workoutId, 10)
    if (Number.isNaN(workoutId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid workout id",
            },
        })
    }

    const results = req.body as Result[]

    try {
        await addResults(athleteId, workoutId, results)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route adds a survey to the workout_surveys table after a workout is completed.
 * The body should be a survey object, which looks like the following:
 * {
 *  - due_date: Date
 *  - rating: number
 *  - hours_sleep: number
 *  - wellness: number
 * }
 */
router.post("/:athleteId/surveys/:workoutId", async (req, res) => {
    const athleteId = Number.parseInt(req.params.athleteId, 10)
    if (Number.isNaN(athleteId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid athlete id",
            },
        })
    }

    const workoutId = Number.parseInt(req.params.workoutId, 10)
    if (Number.isNaN(workoutId)) {
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid workout id",
            },
        })
    }

    const survey = req.body as Survey

    try {
        await addSurvey(athleteId, workoutId, survey)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

export default router
