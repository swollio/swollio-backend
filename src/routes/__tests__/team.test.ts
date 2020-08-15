import express from "express"
import router from "../team"

const app = express()
app.use("/", router)

it("Gets the test endpoint", async (done) => {
    // const res = await request.get('/')
    // expect(res.status).toBe(200)
    done()
})
