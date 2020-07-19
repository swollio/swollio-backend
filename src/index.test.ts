import app from './index'
import supertest from 'supertest'
const request = supertest(app)

it('Gets the test endpoint', async done => {
  const res = await request.get('/test')
  done()
})