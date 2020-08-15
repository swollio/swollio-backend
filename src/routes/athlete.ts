import express from "express"
import db from "../utilities/database"
import Athlete from "../schema/athlete"
import requirePermission from "../middleware/auth"
import Result from "../schema/result"
import Survey from "../schema/survey"
import getAllAthletes from "../workflows/athlete/getAllAthletes"
import addAthlete from "../workflows/athlete/addAthlete"

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
        return res.status(500).send(err)
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
    const { pin } = req.body
    const athlete = req.body as Athlete
    const userId = req.token.user_id

    try {
        await addAthlete(userId, athlete, pin)
        return res.status(200).send("success!")
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})

/**
 * Calls the get athlete workflow, and returns athlete given the id
 */
router.get("/:id", (req, res) => {
    db["athletes.filter_by_id"]([req.params.id])
        .then((result) => {
            res.status(200).send(result.rows[0])
        })
        .catch(() => {
            res.status(500).send()
        })
})

// List athlete workouts
router.get("/:id/workouts", (req, res) => {
    if (req.query.date === "today") {
        db["workouts.filter_by_athlete_today"]([req.params.id])
            .then((result) => {
                res.status(200).send(result.rows)
            })
            .catch(() => {
                res.status(500).send()
            })
    } else {
        db["workouts.filter_by_athlete"]([req.params.id])
            .then((result) => {
                res.status(200).send(result.rows)
            })
            .catch(() => {
                res.status(500).send()
            })
    }
})

// Get athlete's workout
router.get("/:id/workouts/:workout_id", (req, res) => {
    db["assignments.filter_by_workout"]([req.params.workout_id])
        .then((result) => {
            res.status(200).send(result.rows)
        })
        .catch(() => {
            res.status(500).send()
        })
})

// Get athlete's progress over time
router.get("/:id/exercises/", (req, res) => {
    db["statistics.weight_by_exercise"]([req.params.id])
        .then((result) => {
            console.log(result.rows)
            res.status(200).send(result.rows)
        })
        .catch(() => {
            res.status(500).send()
        })
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
router.post("/:athleteId/results/:workout_id", async (req, res) => {
    const results = req.body as Result[]

    if (results.length === 0) {
        res.status(200).send("success")
        return
    }
    await db["results.insert_many"]([
        results.map((result) => [
            req.params.athleteId,
            result.exercise_id,
            result.assignment_id,
            req.params.workout_id,
            result.date,
            result.weight,
            result.reps,
            result.created,
        ]),
    ])
    res.status(200).send("success")
})

/**
 * This route adds a survey to the workout_surveys table after a workout is completed
 */
router.post("/:athleteId/surveys/:workout_id", async (req, res) => {
    const survey = req.body as Survey

    console.log(req.body)

    if (!survey) {
        res.status(500).send("No survey received")
        return
    }

    try {
        await db["surveys.add_one"]([
            survey.athlete_id,
            survey.workout_id,
            survey.due_date,
            survey.rating,
            survey.hours_sleep,
            survey.wellness,
        ])
    } catch (err) {
        console.log(err)
    }
    res.status(200).send("success")
})

export default router
