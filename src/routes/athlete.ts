import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
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