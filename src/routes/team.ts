import express from 'express';
import { requirePermission } from '../middleware/auth';
import Workout from '../schema/workout'
import db from '../utilities/database'

const router = express.Router()
//router.use(requirePermission([]))

// List all teams
router.get('/', (req, res) => {
    db['teams.all']().then(result => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.status(500).send('unknown error');
    });
});

// Find a team
router.get('/:team_id', async (req, res) => {
    db['teams.filter_by_id']([req.params.team_id]).then(result => {
        res.status(200).send(result.rows[0]);
    }).catch((error) => {
        console.log(error);
        res.status(500).send('unknown error');
    });
});

// List team's athletes
router.get('/:team_id/athletes', async (req, res) => {
    let result = await db['athletes.filter_by_team']([
        req.params.team_id,
    ]);
    res.send(result.rows);
});

// Add an athlete for a team
router.post('/:team_id/athletes/:athlete_id', (req, res) => {
    db['teams.add_athlete']([req.params.team_id, req.params.athlete_id])
    .then(result => {
        res.status(200).send('success');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('unknown error');
    });
});

// Delete athlete
router.delete('/:team_id/athletes/:athlete_id', (req, res) => {
    db['teams.remove_athlete']([req.params.team_id, req.params.athlete_id])
    .then(result => {
        res.status(200).send('success');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('unknown error');
    });
});

// Get a team's workouts 
router.get('/:team_id/workouts', async (req, res) => {
    let result = await db['workouts.filter_by_team']([
        req.params.team_id,
    ]);
    res.send(result.rows);
});

// Create a team workouts
router.post('/:team_id/workouts', async (req, res) => {
    let workout = req.body as Workout;
    let result = await db['workouts.insert_one']([
        req.params.team_id,
        workout.name,
        workout.repeat
    ]);
    
    if (workout.assignments.length > 0) {
        await db['assignments.insert_many']([workout.assignments.map(assignment => 
            [
                result.rows[0].id,
                assignment.exercise_id,
                '{' + assignment.rep_count.map(x => '"' + x.toString() + '"').join(",") +'}',
                assignment.weight_scheme
            ]
        )]);
    }
    res.send('success');
});

// Find a team's workout
router.get('/:team_id/workouts/:workout_id', async (req, res) => {
    let result = await db['assignments.filter_by_workout']([
        req.params.workout_id,
    ]);
    res.send(result.rows);
});

// Delete a team's workout
router.delete('/:team_id/workouts/:workout_id', (req, res) => {
    db['workouts.remove_one']([req.params.workout_id])
    .then(result => {
        res.status(200).send('success');
    }).catch((error) => {
        console.log(error);
        res.status(500).send('unknown error');
    });
});

// Get staistics to the team
router.get('/:team_id/statistics', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;