import express from "express"
import supertest from "supertest"
import router from "../exercise"

const app = express()
app.use("/", router)
const request = supertest(app)

it("Gets the test endpoint", async (done) => {
    const res = await request.get("/")
    expect(res.status).toBe(500)
    done()
})
