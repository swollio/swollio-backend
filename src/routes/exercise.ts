import express from 'express';
import { requirePermission } from '../middleware/auth';
import db from '../utilities/database';

const router = express.Router()
// router.use(requirePermission([]))

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

router.get('/:id/similar', (req, res) => {
    db['exercises.filter_by_similar']([req.params.id])
    .then((result) => res.send(result.rows))
    .catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});

// Create an exercise
router.post('/', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

export default router