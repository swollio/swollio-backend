import express from "express"
import supertest from "supertest"
import router from "../athlete"
import db from "../../utilities/database"
import mock from "./mock.json"

const app = express()
app.use("/", router)
const request = supertest(app)

beforeAll(() => {
    return (async () => {
        await db["athletes.setup"]()
        for (let i = 0; i < mock.athletes.length; i++) {
            await db["athletes.insert"]([
                mock.athletes[i].first_name,
                mock.athletes[i].last_name,
                mock.athletes[i].gender,
                mock.athletes[i].height,
                mock.athletes[i].weight,
                mock.athletes[i].age,
            ])
        }
    })()
})

afterAll(() => {
    return (async () => {
        await db["athletes.teardown"]()
    })()
})

it("Lists the athletes", async (done) => {
    const res = await request.get("/")
    expect(res.status).toBe(200)
    const athleteList = res.body
    expect(mock.athletes.length).toEqual(athleteList.length)
    for (let i = 0; i < athleteList.length; i++) {
        expect(mock.athletes[i].first_name).toEqual(athleteList[i].first_name)
        expect(mock.athletes[i].last_name).toEqual(athleteList[i].last_name)
    }
    done()
})

it("Finds an athlete by id", async (done) => {
    const res = await request.get("/1")
    expect(res.status).toBe(200)
    const athleteList = res.body
    expect(mock.athletes[0].first_name).toEqual(athleteList[0].first_name)
    expect(mock.athletes[0].last_name).toEqual(athleteList[0].last_name)
    done()
})
