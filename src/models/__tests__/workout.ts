import { Client } from "pg"

import * as TestDatabase from "../../utilities/testDatabase"
import WorkoutModel from "../workout"

const database = "test:models:workouts"

async function createWorkoutModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Workouts = new WorkoutModel(client)
    return Workouts
}

async function destroyWorkoutModel(Workouts: WorkoutModel) {
    await (Workouts.client as Client).end()
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
        {
            id: 4,
            workout_id: 2,
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
        {
            id: 2,
            name: "Untitled Workout",
            dates: [],
            team_id: 1,
        },
    ],
}

const workout1 = {
    name: "Untitled Workout",
    dates: [],
    assignments: [
        {
            exercise: { id: 3, name: "exercise3", muscles: [] },
            rep_count: [10, 8, 6],
        },
    ],
}

describe("WorkoutModel.createOne", () => {
    it("should store a new workout in the database", async () => {
        const Workouts = await createWorkoutModel({
            exercises: [
                { id: 1, name: "exercise1", team_id: null },
                { id: 2, name: "exercise2", team_id: null },
                { id: 3, name: "exercise3", team_id: null },
            ],
            users: [user1],
            teams: [team1],
        })

        try {
            await Workouts.createOne(1, workout1)

            // Check that the workout table has been updated as expected
            const workoutResult = await Workouts.client.query(
                `SELECT name, dates, team_id FROM workouts`
            )
            expect(workoutResult.rows).toEqual([
                {
                    name: workout1.name,
                    dates: workout1.dates,
                    team_id: 1,
                },
            ])

            // Check that the assignment table has been updated as expected
            const assignmentResult = await Workouts.client.query(
                `SELECT exercise_id, workout_id, rep_count FROM assignments`
            )
            expect(assignmentResult.rows).toEqual([
                { exercise_id: 3, workout_id: 1, rep_count: [10, 8, 6] },
            ])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })
})

describe("WorkoutModel.readOne", () => {
    it("should return the Workout", async () => {
        const Workouts = await createWorkoutModel(dataset)
        try {
            expect(await Workouts.readOne(2)).toEqual({
                id: 2,
                name: "Untitled Workout",
                dates: [],
                assignments: [
                    {
                        id: 4,
                        exercise: { id: 3, name: "exercise3", muscles: [] },
                        rep_count: [10, 8, 6],
                    },
                ],
            })
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })
})

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
                {
                    id: 2,
                    name: "Untitled Workout",
                    dates: [],
                    assignments: [
                        {
                            id: 4,
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

describe("WorkoutModel.updateOne", () => {
    it("should update the workout name", async () => {
        const Workouts = await createWorkoutModel(dataset)

        try {
            await Workouts.updateOne({
                id: 1,
                name: "Leg Day!",
            })

            // Check that the workout table has been updated as expected
            const workoutResult = await Workouts.client.query(
                `SELECT name FROM workouts WHERE id=1`
            )
            expect(workoutResult.rows).toEqual([{ name: "Leg Day!" }])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })

    it("should update the workout dates", async () => {
        const Workouts = await createWorkoutModel(dataset)

        try {
            await Workouts.updateOne({
                id: 1,
                dates: ["2020-11-05T08:15:30-05:00"],
            })

            // Check that the workout table has been updated as expected
            const workoutResult = await Workouts.client.query(
                `SELECT dates FROM workouts WHERE id=1`
            )
            expect(workoutResult.rows).toEqual([
                { dates: [new Date("2020-11-05T08:15:30-05:00")] },
            ])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })

    it("should update the workout assignments", async () => {
        const Workouts = await createWorkoutModel(dataset)

        try {
            await Workouts.updateOne({
                id: 1,
                assignments: [
                    {
                        exercise: { id: 3, name: "exercise3", muscles: [] },
                        rep_count: [10, 8, 6],
                    },
                ],
            })

            // Check that the workout table has been updated as expected
            const workoutResult = await Workouts.client.query(
                `SELECT exercise_id, rep_count FROM assignments WHERE workout_id=1`
            )
            expect(workoutResult.rows).toEqual([
                {
                    exercise_id: 3,
                    rep_count: [10, 8, 6],
                },
            ])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })
})

describe("WorkoutModel.destroyOne", () => {
    it("should delete the workout with id=1", async () => {
        const Workouts = await createWorkoutModel(dataset)

        try {
            await Workouts.destroyOne(1)

            const assignmentResult = await Workouts.client.query(
                `SELECT * FROM assignments WHERE workout_id=1`
            )
            expect(assignmentResult.rows).toEqual([])

            const workoutResult = await Workouts.client.query(
                `SELECT * FROM workouts WHERE id=1`
            )
            expect(workoutResult.rows).toEqual([])
        } finally {
            await destroyWorkoutModel(Workouts)
        }
    })
})
