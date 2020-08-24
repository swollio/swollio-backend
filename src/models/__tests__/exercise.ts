import { Pool } from "pg"
import {
    createTestDatabase,
    destroyTestDatabase,
} from "../../utilities/testDatabase"
import ExerciseModel from "../exercise"

const database = "test:models:exercise"

describe("(dataset 0)", () => {
    const pool = new Pool({ database })
    const Exercises = new ExerciseModel(pool)

    beforeAll(async () => {
        await createTestDatabase(database, {})
    })

    describe("ExerciseModel.all", () => {
        it("should return []", async () => {
            expect(await Exercises.all()).toEqual([])
        })
    })

    describe("ExerciseModel.one: ", () => {
        it("should return null", async () => {
            expect(await Exercises.one(1)).toEqual(null)
        })
    })

    afterAll(async () => {
        await pool.end()
        await destroyTestDatabase(database)
    })
})

describe("(dataset 1)", () => {
    const pool = new Pool({ database })
    const Exercises = new ExerciseModel(pool)

    beforeAll(async () => {
        await createTestDatabase(database, {
            muscles: [
                { id: 1, name: "muscle1", nickname: "m1", region: "abs" },
            ],
            exercises: [{ id: 1, name: "exercise1", team_id: null }],
        })
    })

    describe("ExerciseModel.all", () => {
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

    describe("ExerciseModel.one: ", () => {
        it("should return exercise with no muscles", async () => {
            expect(await Exercises.one(1)).toEqual({
                id: 1,
                name: "exercise1",
                muscles: [],
            })
        })
    })

    afterAll(async () => {
        await pool.end()
        await destroyTestDatabase(database)
    })
})

describe("(dataset 2)", () => {
    const pool = new Pool({ database })
    const Exercises = new ExerciseModel(pool)

    beforeAll(async () => {
        await createTestDatabase(database, {
            muscles: [
                { id: 1, name: "muscle1", nickname: "m1", region: "abs" },
                { id: 2, name: "muscle2", nickname: "m2", region: "arm" },
                { id: 3, name: "muscle3", nickname: "m2", region: "lefts" },
            ],
            exercises: [
                { id: 1, name: "exercise1", team_id: null },
                { id: 2, name: "exercise2", team_id: null },
                { id: 3, name: "exercise3", team_id: null },
            ],
        })
    })

    describe("ExerciseModel.all", () => {
        it("should return all exercises", async () => {
            expect(await Exercises.all()).toEqual([
                { id: 1, name: "exercise1", muscles: [] },
                { id: 2, name: "exercise2", muscles: [] },
                { id: 3, name: "exercise3", muscles: [] },
            ])
        })
    })

    describe("ExerciseModel.one: ", () => {
        it("should return exactly one exercise", async () => {
            expect(await Exercises.one(2)).toEqual({
                id: 2,
                name: "exercise2",
                muscles: [],
            })
        })

        it("should return null when not found", async () => {
            expect(await Exercises.one(100)).toEqual(null)
        })
    })

    afterAll(async () => {
        await pool.end()
        await destroyTestDatabase(database)
    })
})
