import express from 'express';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
router.use(requirePermission([]))

// Get exercises
router.get('/', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

/// Find an exercise
router.get('/:id', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

// Create an exercise
router.post('/', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

export default router