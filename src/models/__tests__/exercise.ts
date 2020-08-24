import { Pool } from "pg"
import {
    createTestDatabase,
    destroyTestDatabase,
} from "../../utilities/testDatabase"
import ExerciseModel from "../exercise"

const database = "test:models:exercise"
const pool = new Pool({
    host: "localhost",
    database,
})
const Exercises = new ExerciseModel(pool)

beforeAll(async () => {
    await createTestDatabase(database, {
        muscles: [{ id: 1, name: "muscle1", nickname: "m1", region: "abs" }],
        exercises: [{ id: 1, name: "exercise1", team_id: null }],
    })
})

describe("ExerciseModel.all: ", () => {
    it("should return exercises with no muscles", async () => {
        expect(await Exercises.all()).toEqual([
            {
                id: 1,
                name: "exercise1",
                muscles: [],
            },
        ])
    })
})

afterAll(async () => {
    await pool.end()
    await destroyTestDatabase(database)
})
