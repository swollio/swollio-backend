import express from 'express';
import db from '../utilities/database';
import { requirePermission } from '../middleware/auth';

const router = express.Router()
router.use(requirePermission([]))

router.get('/:id', (req, res) => {
    db['users.filter_by_id']([req.params.id]).then(result => {
        res.status(200).send(result.rows[0] || {});
    }).catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});

export default router;