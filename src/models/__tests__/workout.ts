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

const user1 = {
    id: 1,
    first_name: "john",
    last_name: "doe",
    email: "johndoe@gmail.com",
    hash: "sksksk",
}

const team1 = {
    id: 1,
    pin: 123456,
    name: "team1",
    coach_id: 1,
    sport: "sport1",
}

const dataset: TestDatabase.MockData = {
    exercises: [
        { id: 1, name: "exercise1", team_id: null },
        { id: 2, name: "exercise2", team_id: null },
        { id: 3, name: "exercise3", team_id: null },
    ],
    users: [user1],
    teams: [team1],
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

describe("WorkoutModel.readAllWithTeamId", () => {
    it("should return [] when the team does not exist", async () => {
        const Workouts = await createWorkoutModel({})
        try {
            expect(await Workouts.readAllWithTeamId(100)).toEqual([])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })

    it("should return [] when the team has no exercises", async () => {
        const Workouts = await createWorkoutModel({
            users: [user1],
            teams: [team1],
        })
        try {
            expect(await Workouts.readAllWithTeamId(team1.id)).toEqual([])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })

    it("should return a workout even when it has no assignments", async () => {
        const Workouts = await createWorkoutModel({
            users: [user1],
            teams: [team1],
            workouts: [
                {
                    id: 1,
                    name: "Untitled Workout",
                    dates: [],
                    team_id: 1,
                },
            ],
        })
        try {
            expect(await Workouts.readAllWithTeamId(team1.id)).toEqual([
                {
                    id: 1,
                    name: "Untitled Workout",
                    dates: [],
                    assignments: [],
                },
            ])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })

    it("should return all workouts for a team", async () => {
        const Workouts = await createWorkoutModel(dataset)
        try {
            expect(await Workouts.readAllWithTeamId(1)).toEqual([
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
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })
})
