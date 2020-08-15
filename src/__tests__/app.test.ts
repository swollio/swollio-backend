import app from '../app'
import supertest from 'supertest'
const request = supertest(app)

it('Gets the test endpoint', async (done) => {
  const res = await request.get('/ping')
  expect(res.status).toBe(200)
  expect(res.text).toBe('pong')
  done()
})