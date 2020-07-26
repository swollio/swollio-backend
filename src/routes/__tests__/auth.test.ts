import express from 'express'
import bodyParser from 'body-parser'
import supertest from 'supertest'
import bcrypt from 'bcrypt'

import router from '../auth'
import db from '../../utilities/database'
import mock from './mock.json'

const app = express();
app.use(bodyParser.json({limit: '5mb'}));
app.use('/', router);

const request = supertest(app)

beforeAll(() => {
    return (async () => {
        await db['users.setup']();
        await db['users.signup']([
            'thomas', 'barrett', 'tbarrett1200@icloud.com',
            await bcrypt.hash('foo-bar-baz', 10)
        ]);
        await db['users.signup']([
            'thomas', 'barrett', 'tbarrett1200@gmail.com',
            await bcrypt.hash('la-la-la', 10)
        ]);
        await db['users.signup']([
            'thomas', 'barrett', 'thomasbarrett@caltech.edu',
            await bcrypt.hash('wheeeooo', 10)
        ]);
    })()
});

afterAll(() => {
    return (async () => {
        await db['users.teardown']();
    })()
});

it('Authenticates valid users', async (done) => {
    const res = await request.post('/login')
    .set('Content-Type', 'application/json')
    .send({
        email: 'thomasbarrett@caltech.edu',
        password: 'wheeeooo',
    })
    expect(res.status).toBe(200)
    done()
})

it('Rejects users that do not exist', async (done) => {
    const res = await request.post('/login')
    .set('Content-Type', 'application/json')
    .send({
        email: 'tomasbarrett@caltech.edu',
        password: 'wheeeooo',
    })
    expect(res.status).toBe(403)
    done()
})

it('Rejects users with incorrect passwords', async (done) => {
    const res = await request.post('/login')
    .set('Content-Type', 'application/json')
    .send({
        email: 'thomasbarrett@caltech.edu',
        password: 'ooops',
    })
    expect(res.status).toBe(403)
    done()
})


