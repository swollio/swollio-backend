import express from "express"
import requirePermission from "../middleware/auth"
import Workout from "../schema/workout"
import Team from "../schema/team"
import db from "../utilities/database"
import generatePin from "../utilities/generatePin"

const router = express.Router()
router.use(requirePermission([]))

// Create a team
router.post("/", (req, res) => {
    // console.log(req.token);
    const team = req.body as Team
    team.pin = generatePin()

    db["teams.add_one"]([team.name, team.sport, req.token.user_id, team.pin])
        .then(() => {
            res.status(200).send("success")
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// List all teams
router.get("/", (req, res) => {
    db["teams.all"]()
        .then((result) => {
            res.status(200).send(result.rows)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// Find a team
router.get("/:team_id", async (req, res) => {
    db["teams.filter_by_id"]([req.params.team_id])
        .then((result) => {
            res.status(200).send(result.rows[0])
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// List team's athletes
router.get("/:team_id/athletes", async (req, res) => {
    const result = await db["athletes.filter_by_team"]([req.params.team_id])
    res.send(result.rows)
})

router.get("/:team_id/coaches", (req, res) => {
    db["teams.all_coaches"]([req.params.team_id])
        .then((result) => {
            res.status(200).send(result.rows)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// // Add an athlete for a team
// router.post('/:team_id/athletes/:athlete_id', (req, res) => {
//     db['teams.add_athlete']([req.params.team_id, req.params.athlete_id])
//     .then(result => {
//         res.status(200).send('success');
//     }).catch((error) => {
//         console.log(error);
//         res.status(500).send('unknown error');
//     });
// });

// Delete athlete
router.delete("/:team_id/athletes/:athlete_id", (req, res) => {
    db["teams.remove_athlete"]([req.params.team_id, req.params.athlete_id])
        .then(() => {
            res.status(200).send("success")
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// Get a team's workouts
router.get("/:team_id/workouts", async (req, res) => {
    const result = await db["workouts.filter_by_team"]([req.params.team_id])
    res.send(result.rows)
})

// Create a team workouts
router.post("/:team_id/workouts", async (req, res) => {
    const workout = req.body as Workout
    const result = await db["workouts.insert_one"]([
        req.params.team_id,
        workout.name,
        `{${workout.repeat.map((x) => `"${x.toString()}"`).join(",")}}`,
        workout.start_date,
        workout.end_date || null,
    ])

    if (workout.assignments.length > 0) {
        await db["assignments.insert_many"]([
            workout.assignments.map((assignment) => [
                result.rows[0].id,
                assignment.exercise_id,
                `{${assignment.rep_count
                    .map((x) => `"${x.toString()}"`)
                    .join(",")}}`,
                assignment.weight_scheme,
            ]),
        ])
    }
    res.send("success")
})

// Create a team workouts
router.post("/:team_id/exercises", async (req, res) => {
    console.log("creating an exercise")
    const exerciseId = (
        await db["exercises.add_custom_exercise"]([
            req.body.name.toLowerCase(),
            req.params.team_id,
        ])
    ).rows[0].id
    await db["exercises.add_muscles_exercises"]([
        req.body.muscles.map((m: any) => [m.id, exerciseId]),
    ])
    res.json(exerciseId)
})

// Find a team's workout
router.get("/:team_id/workouts/:workout_id", async (req, res) => {
    const result = await db["assignments.filter_by_workout"]([
        req.params.workout_id,
    ])
    res.send(result.rows)
})

// Delete a team's workout
router.delete("/:team_id/workouts/:workout_id", async (req, res) => {
    await db["workouts.remove_one"]([req.params.workout_id])
        .then(() => {
            res.status(200).send("success")
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send("unknown error")
        })
})

// Get staistics to the team
router.get("/:team_id/statistics", (req, res) => {
    res.status(500)
    res.send("unimplemented")
})

// Add athlete tag
router.post("/addTag/:athlete_id/:team_tag_id", async (req, res) => {
    await db["tags.add_athlete_tag"]([
        req.params.athlete_id,
        req.params.team_tag_id,
    ])
    res.status(200).send("success!")
})

// Get all team's tags
router.get("/:team_id/getTags", async (req, res) => {
    const result = await db["tags.get_all_team_tags"]([req.params.team_id])
    res.status(200).send(result.rows)
})

// Get athlete's tags
router.get(`/:team_id/getAthleteTags/:athlete_id`, async (req, res) => {
    const result = await db["tags.get_athlete_tags"]([
        req.params.athlete_id,
        req.params.team_id,
    ])
    res.status(200).send(result.rows)
})

export default router
