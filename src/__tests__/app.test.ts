import supertest from "supertest"
import app from "../app"

const request = supertest(app)

it("Gets the test endpoint", async (done) => {
    const res = await request.get("/ping")
    expect(res.status).toBe(200)
    expect(res.text).toBe("pong")
    done()
})
