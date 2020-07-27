import express from 'express';
import db from '../utilities/database';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
//router.use(requirePermission([]))

router.get('/', (req, res) => {
    db['athletes.all']().then(result => {
        res.status(200).send(result.rows);
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

// Add athlete's workout results
router.post('/:id/exercises', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;