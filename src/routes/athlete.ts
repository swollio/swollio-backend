import express from 'express'
import db from '../database'

const router = express.Router()

router.get('/', (req, res) => {
    db['athletes.all']().then(result => {
        res.send(result.rows);
    }).catch(() => {
        res.status(500).send();
    });
});

router.get('/:id', (req, res) => {
    db['athletes.one']([req.params.id]).then(result => {
        res.send(result.rows);
    }).catch(() => {
        res.status(500).send();
    });
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