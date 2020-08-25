import * as TestDatabase from "../../utilities/testDatabase"
import TeamModel from "../team"

const database = "test:models:teams"

async function createTeamModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Teams = new TeamModel(client)
    return Teams
}

async function destroyTeamModel(Teams: TeamModel) {
    await Teams.client.end()
    await TestDatabase.destroy(database)
}

const user1 = {
    id: 1,
    first_name: "harry",
    last_name: "potter",
    email: "hpotter@gryffindor.com",
    hash: "$2y$10$Bf/KdAj7oC6.1CFtdbzqLuKTssBNUREurYdqH./aLZK7dE1Z183v6",
}

const user2 = {
    id: 2,
    first_name: "draco",
    last_name: "malfoy",
    email: "dmalfoy@slytherin.com",
    hash: "$2y$10$omEtd4uX2Kb0gSB4ygfzxeWI97ULJkhF19W2qgKFFxURuByceDCj.",
}

const user3 = {
    id: 3,
    first_name: "ron",
    last_name: "weasley",
    email: "rweasley@gryffindor.com",
    hash: "$2y$10$0FebiME5wX5zbkJOhFnLU.j0Is8tlz2tRub5pXXUery95T/U3zkiW",
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
