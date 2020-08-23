import util from "util"
import { exec } from "child_process"
import { Pool } from "pg"

import ExerciseModel from "../exercise"
import Exercise from "../../schema/exercise"
import Muscle from "../../schema/muscle"

async function createTestDatabase(
    database: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _data: { muscles: Muscle[]; exercises: Exercise[] }
) {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
    await util.promisify(exec)(`createdb ${database} --no-password`)
}

async function destroyTestDatabase(database: string) {
    await util.promisify(exec)(`dropdb ${database}`)
}
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
