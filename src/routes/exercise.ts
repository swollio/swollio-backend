import express from 'express'
import { requirePermission } from '../utils'

const router = express.Router()
router.use(requirePermission([]))

router.get('/', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

router.get('/:id', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

router.post('/', (req, res) => {
    res.status(500)
    res.send("unimplemented")
});

export default router