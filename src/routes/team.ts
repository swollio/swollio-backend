import express from 'express';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
router.use(requirePermission([]))

// List all teams
router.get('/', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Find a team
router.get('/:team_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// List team's athletes
router.get('/:team_id/athletes', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Add an athlete for a team
router.post('/:team_id/athletes', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Delete athlete
router.delete('/:team_id/athletes/:athlete_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Get a team's workouts 
router.get('/:team_id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Create a team workouts
router.post('/:team_id/workouts', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Find a team's workout
router.get('/:team_id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Delete a team's workout
router.delete('/:team_id/workouts/:workout_id', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

// Get staistics to the team
router.get('/:team_id/statistics', (req, res) => {
    res.status(500)
    res.send('unimplemented')
});

export default router;