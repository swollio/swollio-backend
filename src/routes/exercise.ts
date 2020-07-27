import express from 'express';
import { requirePermission } from '../middleware/auth';
import db from '../utilities/database';

const router = express.Router()
// router.use(requirePermission([]))

// Get exercises
router.get('/', (req, res) => {
    if (req.query.search) {
        db['exercises.search_by_name']([req.query.search])
        .then(result => {
            res.status(200).send(result.rows);
        }).catch(() => {
            res.status(500).send('unknown error');
        });
    } else {
        db['exercises.all']()
        .then(result => {
            res.status(200).send(result.rows);
        }).catch(() => {
            res.status(500).send('unknown error');
        });
    }
});

/// Find an exercise
router.get('/:id', (req, res) => {
    db['exercises.filter_by_id']([req.params.id])
    .then(result => {
        res.status(200).send(result.rows[0]);
    }).catch(() => {
        res.status(500).send('unknown error');
    });
});

router.get('/:id/similar', (req, res) => {
    db['exercises.filter_by_similar']([req.params.id])
    .then((result) => {
        res.send(result.rows)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).send('unknown error');
    });
});

export default router