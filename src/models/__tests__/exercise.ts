import * as TestDatabase from "../../utilities/testDatabase"
import ExerciseModel from "../exercise"

const database = "test:models:exercise"

async function createExerciseModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Exercises = new ExerciseModel(client)
    return Exercises
}

async function destroyExerciseModel(Exercises: ExerciseModel) {
    await Exercises.client.end()
    await TestDatabase.destroy(database)
}

const dataset1: TestDatabase.MockData = {
    muscles: [{ id: 1, name: "muscle1", nickname: "m1", region: "abs" }],
    exercises: [{ id: 1, name: "exercise1", team_id: null }],
}

const dataset2: TestDatabase.MockData = {
    muscles: [
        { id: 1, name: "muscle1", nickname: "m1", region: "abs" },
        { id: 2, name: "muscle2", nickname: "m2", region: "arm" },
        { id: 3, name: "muscle3", nickname: "m2", region: "leg" },
    ],
    exercises: [
        { id: 1, name: "exercise1", team_id: null },
        { id: 2, name: "exercise2", team_id: null },
        { id: 3, name: "exercise3", team_id: null },
    ],
}

describe("ExerciseModel.all", () => {
    it("should return [] when there are no exercises", async () => {
        const Exercises = await createExerciseModel({})
        expect(await Exercises.all()).toEqual([])
        await destroyExerciseModel(Exercises)
    })

    it("should return exercises with no muscles", async () => {
        const Exercises = await createExerciseModel(dataset1)
        expect(await Exercises.all()).toEqual([
            {
                id: 1,
                name: "exercise1",
                muscles: [],
            },
        ])
        await destroyExerciseModel(Exercises)
    })

    it("should return all exercises", async () => {
        const Exercises = await createExerciseModel(dataset2)
        expect(await Exercises.all()).toEqual([
            { id: 1, name: "exercise1", muscles: [] },
            { id: 2, name: "exercise2", muscles: [] },
            { id: 3, name: "exercise3", muscles: [] },
        ])
        await destroyExerciseModel(Exercises)
    })
})

describe("ExerciseModel.one: ", () => {
    it("should return null", async () => {
        const Exercises = await createExerciseModel({})
        expect(await Exercises.one(1)).toEqual(null)
        await destroyExerciseModel(Exercises)
    })

    it("should return exercise with no muscles", async () => {
        const Exercises = await createExerciseModel(dataset1)
        expect(await Exercises.one(1)).toEqual({
            id: 1,
            name: "exercise1",
            muscles: [],
        })
        await destroyExerciseModel(Exercises)
    })

    it("should return exactly one exercise", async () => {
        const Exercises = await createExerciseModel(dataset2)
        expect(await Exercises.one(2)).toEqual({
            id: 2,
            name: "exercise2",
            muscles: [],
        })
        await destroyExerciseModel(Exercises)
    })
})

describe("ExerciseModel.search: ", () => {
    it("should return []", async () => {
        const Exercises = await createExerciseModel({})
        expect(await Exercises.search("bar")).toEqual([])
        await destroyExerciseModel(Exercises)
    })

    it("should return exercises with similar name", async () => {
        const Exercises = await createExerciseModel(dataset1)
        expect(await Exercises.search("exercise")).toEqual([
            {
                id: 1,
                name: "exercise1",
                muscles: [],
            },
        ])
        await destroyExerciseModel(Exercises)
    })

    it("should return all exercises with similar name", async () => {
        const Exercises = await createExerciseModel(dataset2)
        expect(await Exercises.search("exercise")).toEqual([
            { id: 1, name: "exercise1", muscles: [] },
            { id: 2, name: "exercise2", muscles: [] },
            { id: 3, name: "exercise3", muscles: [] },
        ])
        await destroyExerciseModel(Exercises)
    })

    it("should not return exercises with dis-similar name", async () => {
        const Exercises = await createExerciseModel(dataset2)
        expect(await Exercises.search("2")).toEqual([
            { id: 2, name: "exercise2", muscles: [] },
        ])
        await destroyExerciseModel(Exercises)
    })
})

describe("ExerciseModel.create: ", () => {
    it("should insert exercise", async () => {
        const Exercises = await createExerciseModel({})
        await Exercises.create(null, {
            name: "exercise1",
            muscles: [],
        })
        expect(await Exercises.all()).toEqual([
            {
                id: 1,
                name: "exercise1",
                muscles: [],
            },
        ])
        await destroyExerciseModel(Exercises)
    })
})
