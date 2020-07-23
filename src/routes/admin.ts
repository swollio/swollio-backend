import express from 'express';
import db from '../database';
import * as constants from '../constants';

const app = express();

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({hello: "world"});
});

router.get('/instantiate/exercises', (req, res) => {
    db['exercises.instantiate']().then(result => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log(error)
        res.status(500).send();
    });
});

router.get('/instantiate/muscles', (req, res) => {
    constants.muscles.forEach(muscle => {
        db['exercises.insert_muscles']([muscle.name]).then(
            result => res.status(200).send(result.rows)
        ).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    });
});


export default router;