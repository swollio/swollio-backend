import express from 'express';
import router from '../admin';
import supertest from 'supertest';
import db from '../../utilities/database';
import mock from './mock.json';
import * as constants from '../../utilities/constants';

var app = express();
app.use('/', router);
const request = supertest(app);

beforeAll(() => {
    return (async () => {
        // Instantiating all tables
        await db['exercises.instantiate']();

        // Populating muscles array with muscles
        constants.muscles.forEach(muscle => {
            db['insert_muscles']([muscle.name]);
        });
    });
});

afterAll(() => {
    return (async () => {
        await db['exercises.teardown']();
    })
});

// Not quite sure what tests to do here, but we are getting somewhere!