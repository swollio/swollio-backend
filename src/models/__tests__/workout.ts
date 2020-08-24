import * as TestDatabase from "../../utilities/testDatabase"
import WorkoutModel from "../workout"

const database = "test:models:workouts"

async function createWorkoutModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Workouts = new WorkoutModel(client)
    return Workouts
}

async function destroyWorkoutModel(Workouts: WorkoutModel) {
    await Workouts.client.end()
    await TestDatabase.destroy(database)
}

const dataset: TestDatabase.MockData = {
    exercises: [
        { id: 1, name: "exercise1", team_id: null },
        { id: 2, name: "exercise2", team_id: null },
        { id: 3, name: "exercise3", team_id: null },
    ],
    users: [
        {
            id: 1,
            first_name: "john",
            last_name: "doe",
            email: "johndoe@gmail.com",
            hash: "sksksk",
        },
    ],
    teams: [
        {
            id: 1,
            pin: 123456,
            name: "team1",
            coach_id: 1,
            sport: "sport1",
        },
    ],
    assignments: [
        {
            id: 1,
            workout_id: 1,
            exercise_id: 1,
            rep_count: [10, 8, 6],
        },
        {
            id: 2,
            workout_id: 1,
            exercise_id: 2,
            rep_count: [10, 8, 6],
        },
        {
            id: 3,
            workout_id: 1,
            exercise_id: 3,
            rep_count: [10, 8, 6],
        },
    ],
    workouts: [
        {
            id: 1,
            name: "Untitled Workout",
            dates: [],
            team_id: 1,
        },
    ],
}

describe("WorkoutModel.all", () => {
    it("should return [] when there are no workouts", async () => {
        const Workouts = await createWorkoutModel(dataset)
        expect(await Workouts.all(1)).toEqual([
            {
                id: 1,
                name: "Untitled Workout",
                dates: [],
                assignments: [
                    {
                        id: 1,
                        exercise: { id: 1, name: "exercise1", muscles: [] },
                        rep_count: [10, 8, 6],
                    },
                    {
                        id: 2,
                        exercise: { id: 2, name: "exercise2", muscles: [] },
                        rep_count: [10, 8, 6],
                    },
                    {
                        id: 3,
                        exercise: { id: 3, name: "exercise3", muscles: [] },
                        rep_count: [10, 8, 6],
                    },
                ],
            },
        ])
        await destroyWorkoutModel(Workouts)
    })

    it("should return all workouts for a team", async () => {
        const Workouts = await createWorkoutModel({})
        expect(await Workouts.all(100)).toEqual([])
        await destroyWorkoutModel(Workouts)
    })
})
