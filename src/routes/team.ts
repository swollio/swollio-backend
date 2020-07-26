import express from 'express';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
router.use(requirePermission([]))

router.get('/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:team_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:team_id/athletes', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.post('/:team_id/athletes', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.delete('/:team_id/athletes/:athlete_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:team_id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.post('/:team_id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.get('/:team_id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.delete('/:team_id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

router.post('/:team_id/statistics', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;