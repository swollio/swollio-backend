import app from './index'
import supertest from 'supertest'

test("GET /", done => {
  supertest(app)
    .get("/")
    .expect(200, 'hello world')
    .end(done)
})