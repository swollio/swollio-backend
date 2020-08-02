import express from 'express';
import db from '../utilities/database';
import Athlete from '../schema/athlete'
import { requirePermission } from '../middleware/auth';
import Result from '../schema/result';

const router = express.Router()
router.use(requirePermission([]))

router.get('/', (req, res) => {
    db['athletes.all']().then(result => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});


router.post('/', (req, res) => {
    const athlete = req.body as Athlete;
    db['athletes.add_one']([
        req.token.user_id,
        athlete.age,
        athlete.height,
        athlete.weight,
        athlete.gender
    ]).then(result => {
        res.status(200).send('success');
    }).catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});


// Find athlete
router.get('/:id', (req, res) => {
    db['athletes.filter_by_id']([req.params.id]).then(result => {
        res.status(200).send(result.rows[0]);
    }).catch(() => {
        res.status(500).send();
    });
});

// List athlete workouts
router.get('/:id/workouts', (req, res) => {
    db['workouts.filter_by_athlete']([req.params.id]).then(result => {
        res.status(200).send(result.rows);
    }).catch(() => {
        res.status(500).send();
    });
});

// Get athlete's workout
router.get('/:id/workouts/:workout_id', (req, res) => {
    db['assignments.filter_by_workout']([req.params.workout_id]).then(result => {
        res.status(200).send(result.rows);
    }).catch(() => {
        res.status(500).send();
    });
});

// Get athlete's progress over time
router.get('/:id/exercises/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

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
router.post('/:athlete_id/results/:workout_id', async (req, res) => {
    const results = req.body as Result[];
    await db['results.insert_many']([results.map(result => 
        [
            req.params.athlete_id,
            result.exercise_id,
            result.assignment_id,
            result.weight,
            result.reps,
        ]
    )]);    
    res.send('success')
});

export default router;