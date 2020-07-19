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


export default router;