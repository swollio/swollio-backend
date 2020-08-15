import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from '../utilities/database'
import config from '../config.json'
 
const router = express.Router()

router.post('/login', async (req, res) => {

    const user = await db['users.login']([req.body.email]);
    if (user.rows.length == 0) {
        console.log(`login: failure: ${req.body.email} `)
        res.status(403).send('incorrect email');
        return;
    }
    const user_id = user.rows[0].id;
    const hash = user.rows[0].hash;
    const valid = await bcrypt.compare(req.body.password, hash);
    if (valid) {
        const token = jwt.sign({
            user_id: user_id
        }, config.auth.secret, { expiresIn: "1 day" });
        console.log(`login: success: ${req.body.email} `)
        res.send(token);
    } else {
        console.log(`login: failure: ${req.body.email} `)
        res.status(403).send('incorrect email or password')
    }
});

router.post('/signup', async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await db['users.signup']([
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hash
        ]);

        const token = jwt.sign({
            user_id: user.rows[0].id
        }, config.auth.secret, { expiresIn: "1 day" });
        res.send(token);
    } catch (error) {
        res.status(403).send('unable to create account')
    }

});

export default router;