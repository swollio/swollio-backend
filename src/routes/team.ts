import express from "express"
import requirePermission from "../middleware/auth"

import Workout from "../schema/workout"
import Team from "../schema/team"

import createTeam from "../workflows/teams/createTeam"
import getTeams from "../workflows/teams/getTeams"
import findTeam from "../workflows/teams/findTeam"
import getTeamAthletes from "../workflows/teams/getTeamAthletes"
import getTeamCoaches from "../workflows/teams/getTeamCoaches"
import deleteAthlete from "../workflows/teams/deleteAthlete"
import getTeamWorkouts from "../workflows/teams/getTeamWorkouts"
import createTeamWorkout from "../workflows/teams/createTeamWorkouts"
import updateTeamWorkout from "../workflows/teams/updateTeamWorkout"
import addAthleteTag from "../workflows/teams/addAthleteTag"
import getAllTeamTags from "../workflows/teams/getAllTeamTags"
import getAllAthleteTags from "../workflows/teams/getAllAthleteTags"
import getTeamWorkout from "../workflows/teams/getTeamWorkout"
import deleteWorkout from "../workflows/teams/deleteWorkout"
import addTeamTag from "../workflows/teams/addTeamTag"

import db, { pool } from "../utilities/database"
import ExerciseModel from "../models/exercise"

const router = express.Router()
router.use(requirePermission([]))

/**
 * This route calls the createTeam workflow, which will
 * add the team to the teams database and assign it a 6 digit pin
 * The body must contain the following:
 * {
 *  - name: string
 *  - sport: string
 * }
 */
router.post("/", async (req, res) => {
    const userId = Number.parseInt(req.token.user_id, 10)
    const team = req.body as Team

    try {
        await createTeam(userId, team)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getTeams workflow, which will
 * return an array of all the teams in the database. This
 * route returns the array as a response.
 */
router.get("/", async (req, res) => {
    try {
        const teams = await getTeams()
        return res.status(200).send(teams)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the findTeam workflow, and returns a
 * team with the given id (in the request parameters). If
 * there is no team in the database with the given id, then
 * the workflow will return null
 */
router.get("/:team_id", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    try {
        const team = await findTeam(teamId)
        return res.status(200).send(team)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getTeamAthletes workflow, and gets
 * all the athletes for a team given by the response parameters
 */
router.get("/:team_id/athletes", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)

    try {
        const athletes = await getTeamAthletes(teamId)
        return res.status(200).send(athletes)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getTeamCoaches workflow, which will
 * get all the coaches for a given team
 */
router.get("/:team_id/coaches", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)

    try {
        const coaches = await getTeamCoaches(teamId)
        return res.status(200).send(coaches)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the deleteAthlete workflow, which will delete
 * an athlete from a given team using the request parameters
 */
router.delete("/:team_id/athletes/:athlete_id", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const athleteId = Number.parseInt(req.params.athlete_id, 10)

    try {
        await deleteAthlete(teamId, athleteId)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getTeamWorkouts workflow, and will return
 * all the workouts for a given team using the request parameters
 */
router.get("/:team_id/workouts", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)

    try {
        const workouts = await getTeamWorkouts(teamId)
        return res.status(200).send(workouts)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the createTeamWorkout workflow, which will
 * add a workout to the workouts table, and then add all assignments
 * to in the workout to the assignments table. The body of this request
 * shold contain a workout, which has the following keys:
 * {
 *  - name: string
 *  - dates: string[]
 *  - assignments: Assignment[]
 * }
 */
router.post("/:team_id/workouts", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const workout = req.body as Workout

    try {
        await createTeamWorkout(teamId, null, workout)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the createTeamWorkout workflow, which will
 * add a workout to the workouts table, and then add all assignments
 * to in the workout to the assignments table. The body of this request
 * shold contain a workout, which has the following keys:
 * {
 *  - name: string
 *  - dates: string[]
 *  - assignments: Assignment[]
 * }
 */
router.put("/:team_id/workouts", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const workout = req.body as Workout

    try {
        await updateTeamWorkout(workout)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the createTeamExercise workflow, which
 * will create a custom exercise in the database. The exercise
 * will be added with the team id from the request parameters and
 * the exercise data from the body:
 * {
 *  - name: string
 *  - muscles: Muscle[]
 * }
 */
router.post("/:team_id/exercises", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const data = {
        name: req.body.name,
        muscles: req.body.muscles,
    }
    const client = await pool.connect()
    const Exercises = new ExerciseModel(client)
    try {
        const exercise = await Exercises.createOne(teamId, data)
        return res.status(200).json(exercise)
    } catch (err) {
        console.log(err.toString())
        return res.status(500).send(err.toString())
    } finally {
        client.release()
    }
})

/**
 * This route calls the getTeamWorkout workflow, which will get all of the
 * assignments for a team given the workout id. The team and workout ids are
 * passed via the request parameters
 */
router.get("/:team_id/workouts/:workout_id", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const workoutId = Number.parseInt(req.params.workout_id, 10)
    try {
        const workout = await getTeamWorkout(teamId, workoutId)
        return res.status(200).send(workout)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the deleteWorkout workflow, which will delete
 * the workout with the given workout id from team with the given
 * team id from the workouts database.
 */
router.delete("/:team_id/workouts/:workout_id", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const workoutId = Number.parseInt(req.params.workout_id, 10)

    try {
        await deleteWorkout(teamId, workoutId)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the addTeamTag workflow and adds the respective
 * team tag to the team_tags table
 */
router.post("/:team_id/tags/:tag", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    const { tag } = req.params

    try {
        const teamTagId = await addTeamTag(teamId, tag)
        return res.status(200).send(teamTagId)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the addAthleteTag workflow and adds the respective
 * team tag to the respective athlete as per the request parameters
 */
router.post("/tags/:athlete_id/:team_tag_id", async (req, res) => {
    const teamTagId = Number.parseInt(req.params.team_tag_id, 10)
    const athleteId = Number.parseInt(req.params.athlete_id, 10)
    try {
        await addAthleteTag(athleteId, teamTagId)
        return res.status(200).send({})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getAllTeamTags workflow, which will
 * get all the team tags for the team whose id is passed in
 * the request parameters
 */
router.get("/:team_id/tags", async (req, res) => {
    const teamId = Number.parseInt(req.params.team_id, 10)
    try {
        const teamTags = await getAllTeamTags(teamId)
        return res.status(200).send(teamTags)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

/**
 * This route calls the getAllAthleteTags workflow, which will get all the
 * tags of the athlete with the given id on the given team as per the request
 * parameters
 */
router.get("/:team_id/athletes/:athlete_id/tags", async (req, res) => {
    const athleteId = Number.parseInt(req.params.athlete_id, 10)
    const teamId = Number.parseInt(req.params.team_id, 10)

    try {
        const tags = await getAllAthleteTags(athleteId, teamId)
        return res.status(200).send(tags)
    } catch (err) {
        console.log(err)
        return res.status(500).send(err.message)
    }
})

// Add an athlete for a team
router.post("/:team_id/athletes/:athlete_id", (req, res) => {
    db["teams.add_athlete"]([req.params.team_id, req.params.athlete_id])
        .then((result) => {
            res.status(200).send({})
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// // Get statistics to the team
// router.get("/:team_id/statistics", (req, res) => {
//     res.status(500)
//     res.send("unimplemented")
// })

export default router
