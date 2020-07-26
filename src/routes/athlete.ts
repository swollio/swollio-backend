import express from 'express';
import db from '../utilities/database';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
router.use(requirePermission([]))

router.get('/', (req, res) => {
    db['athletes.list']().then(result => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});

// Find athlete
router.get('/:id', (req, res) => {
    db['athletes.find']([req.params.id]).then(result => {
        res.status(200).send(result.rows);
    }).catch(() => {
        res.status(500).send();
    });
});

// List athlete workouts
router.get('/:id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Get athlete's workout
router.get('/:id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Get athlete's progress over time
router.get('/:id/exercises/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Add athlete's workout results
router.post('/:id/statistics', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;