import { Client } from "pg"

import * as TestDatabase from "../../utilities/testDatabase"
import TeamModel from "../team"

const database = "test:models:teams"

async function createTeamModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Teams = new TeamModel(client)
    return Teams
}

async function destroyTeamModel(Teams: TeamModel) {
    await (Teams.client as Client).end()
    await TestDatabase.destroy(database)
}

const user4 = {
    id: 4,
    first_name: "minvera",
    last_name: "mcgonagall",
    email: "mmcgonagall@hogwarts.com",
    hash: "$2y$10$0FebiME5wX5zbkJOhFnLU.j0Is8tlz2tRub5pXXUery95T/U3zkiW",
}

const team1 = {
    id: 1,
    pin: 123456,
    name: "Gryffindor",
    coach: {
        id: 4,
        first_name: "minvera",
        last_name: "mcgonagall",
        email: "mmcgonagall@hogwarts.com",
    },
    sport: "Quidditch",
}

describe("TeamModel.createOne", () => {
    it("should store a new team in the database", async () => {
        const Teams = await createTeamModel({ users: [user4] })
        try {
            await Teams.createOne(team1)
            const result = await Teams.client.query(
                `SELECT id, pin, name, coach_id, sport FROM teams`
            )
            expect(result.rows).toEqual([
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ])
        } finally {
            await destroyTeamModel(Teams)
        }
    })
})

describe("TeamModel.readOne", () => {
    it("should return team1 for id=1", async () => {
        const Teams = await createTeamModel({
            users: [user4],
            teams: [
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ],
        })
        try {
            const team = await Teams.readOne(1)
            expect(team).toEqual(team1)
        } finally {
            await destroyTeamModel(Teams)
        }
    })
})

describe("TeamModel.updateOne", () => {
    it("should update pin ", async () => {
        const Teams = await createTeamModel({
            users: [user4],
            teams: [
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ],
        })
        try {
            await Teams.updateOne(1, {
                pin: 666666,
            })
            const result = await Teams.client.query(
                "SELECT pin FROM teams WHERE id=1"
            )
            expect(result.rows[0].pin).toEqual(666666)
        } finally {
            await destroyTeamModel(Teams)
        }
    })

    it("should update name ", async () => {
        const Teams = await createTeamModel({
            users: [user4],
            teams: [
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ],
        })
        try {
            await Teams.updateOne(1, {
                name: "test",
            })
            const result = await Teams.client.query(
                "SELECT name FROM teams WHERE id=1"
            )
            expect(result.rows[0].name).toEqual("test")
        } finally {
            await destroyTeamModel(Teams)
        }
    })

    it("should update sport ", async () => {
        const Teams = await createTeamModel({
            users: [user4],
            teams: [
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ],
        })
        try {
            await Teams.updateOne(1, {
                sport: "test",
            })
            const result = await Teams.client.query(
                "SELECT sport FROM teams WHERE id=1"
            )
            expect(result.rows[0].sport).toEqual("test")
        } finally {
            await destroyTeamModel(Teams)
        }
    })
})

describe("TeamModel.destroyOne", () => {
    it("should successfully delete team", async () => {
        const Teams = await createTeamModel({
            users: [user4],
            teams: [
                {
                    id: team1.id,
                    pin: team1.pin,
                    name: team1.name,
                    coach_id: team1.coach.id,
                    sport: team1.sport,
                },
            ],
        })
        try {
            await Teams.destroyOne(1)
            const result = await Teams.client.query("SELECT id FROM teams")
            expect(result.rows).toEqual([])
        } finally {
            await destroyTeamModel(Teams)
        }
    })
})
