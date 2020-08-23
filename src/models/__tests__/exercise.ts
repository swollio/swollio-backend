import { Pool } from "pg"
import { createTestDatabase, destroyTestDatabase } from "../../utilities/test"
import ExerciseModel from "../exercise"

const database = "tests:models:exercises"
const pool = new Pool({
    host: "localhost",
    database,
})
const Exercises = new ExerciseModel(pool)

beforeAll(async () => {
    await createTestDatabase(database, {
        muscles: [],
        exercises: [],
    })
})

describe("ExerciseModel.all", () => {
    test("it should return []", async () => {
        expect(await Exercises.all()).toEqual([])
    })
})

afterAll(async () => {
    await pool.end()
    await destroyTestDatabase(database)
})
