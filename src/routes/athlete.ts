import express from 'express'
import db from '../database'

const router = express.Router()

router.get('/', (req, res) => {
    db['users.all']().then(result => {
        res.send(result.rows);
    }).catch(error => {
        res.status(500);
        res.send("error: unkown")
    })
});

router.get('/:id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:id/exercises/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;