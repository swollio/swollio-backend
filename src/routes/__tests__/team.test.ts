import express from 'express'
import router from '../team'
import supertest from 'supertest'

const app = express();
app.use('/', router);
const request = supertest(app)

it('Gets the test endpoint', async (done) => {
  const res = await request.get('/')
  expect(res.status).toBe(200)
  done()
})