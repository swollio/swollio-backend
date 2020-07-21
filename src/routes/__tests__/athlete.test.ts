import express from 'express'
import router from '../athlete'
import supertest from 'supertest'
import db from '../../database'
import mock from './mock.json'

const app = express();
app.use('/', router);
const request = supertest(app)

beforeAll(() => {
    return (async () => {
        await db['athletes.setup']();
        for (let i = 0; i < mock.athletes.length; i++) {
            await db['athletes.insert']([
                mock.athletes[i].first_name,
                mock.athletes[i].last_name,
                mock.athletes[i].gender,
                mock.athletes[i].height,
                mock.athletes[i].weight,
                mock.athletes[i].age,
            ]);
        }
    })()
});

afterAll(() => {
    return (async () => {
        await db['athletes.teardown']();
    })()
});

it('Lists the athletes', async (done) => {
    const res = await request.get('/')
    expect(res.status).toBe(200)
    const athlete_list = res.body;
    expect(mock.athletes.length).toEqual(athlete_list.length);
    for (let i = 0; i < athlete_list.length; i++) {
        expect(mock.athletes[i].first_name).toEqual(athlete_list[i].first_name);
        expect(mock.athletes[i].last_name).toEqual(athlete_list[i].last_name);
    }
    done()
})

it('Finds an athlete by id', async (done) => {
    const res = await request.get('/1')
    expect(res.status).toBe(200)
    const athlete_list = res.body;
    expect(mock.athletes[0].first_name).toEqual(athlete_list[0].first_name);
    expect(mock.athletes[0].last_name).toEqual(athlete_list[0].last_name);
    done()
})