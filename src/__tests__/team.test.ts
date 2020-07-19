import express from 'express'
<<<<<<< HEAD:src/routes/__tests__/team.test.ts
import router from '../team'
=======
import router from '../routes/team'
>>>>>>> 2b009423606cafddc8d5cca5309a8a34e1974e29:src/__tests__/team.test.ts
import supertest from 'supertest'

const app = express();
app.use('/', router);
const request = supertest(app);

it('Gets the test endpoint', async (done) => {
  const res = await request.get('/')
  expect(res.status).toBe(200)
  done()
})