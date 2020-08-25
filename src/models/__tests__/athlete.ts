import * as TestDatabase from "../../utilities/testDatabase"
import AthleteModel from "../athlete"

const database = "test:models:athletes"

async function createAthleteModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Athletes = new AthleteModel(client)
    return Athletes
}

async function destroyAthleteModel(Athletes: AthleteModel) {
    await Athletes.client.end()
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
    first_name: "harold",
    last_name: "potter",
    email: "hpotter@gryffindor.com",
    hash: "$2y$10$.8N0AuC6YHR6b/TDU6r42.qc9ACVxjoZXcm0X/eJht0QfcStJudPe",
}

const athlete1 = {
    id: 1,
    user_id: 1,
    age: 20,
    height: 70,
    weight: 180,
    gender: "male",
}

const athlete2 = {
    id: 2,
    user_id: 3,
    age: 20,
    height: 68,
    weight: 165,
    gender: "male",
}

const athlete3 = {
    id: 3,
    user_id: 1,
    age: 22,
    height: 70,
    weight: 170,
    gender: "male",
}

const athlete4 = {
    id: 4,
    user_id: 100,
    age: 22,
    height: 70,
    weight: 170,
    gender: "male",
}

describe("AthleteModel.createOne", () => {
    it("should store a new athlete in the database", async () => {
        const Athletes = await createAthleteModel({ users: [user1] })
        try {
            await Athletes.createOne(athlete1)
            const result = await Athletes.client.query(
                `SELECT id, user_id, age, height, weight, gender FROM athletes`
            )
            expect(result.rows).toEqual([athlete1])
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })

    it("should throw when attempting to recreate athlete account ", async () => {
        const Athletes = await createAthleteModel({
            users: [user1],
            athletes: [athlete1],
        })
        try {
            await expect(Athletes.createOne(athlete3)).rejects.toThrow()
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })

    it("should throw when attempting to create athlete account for non-existant user", async () => {
        const Athletes = await createAthleteModel({
            users: [user1],
            athletes: [athlete1],
        })
        try {
            await expect(Athletes.createOne(athlete4)).rejects.toThrow()
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })
})

describe("AthleteModel.readOne", () => {
    it("should return athlete1 for id=1", async () => {
        const Athletes = await createAthleteModel({
            users: [user1, user2, user3],
            athletes: [athlete1, athlete2],
        })
        try {
            const athlete = await Athletes.readOne(1)
            expect(athlete).toEqual(athlete1)
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })

    it("should return athlete2 for id=2", async () => {
        const Athletes = await createAthleteModel({
            users: [user1, user2, user3],
            athletes: [athlete1, athlete2],
        })
        try {
            const athlete = await Athletes.readOne(2)
            expect(athlete).toEqual(athlete2)
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })

    it("should return when athlete does not exist", async () => {
        const Athletes = await createAthleteModel({
            users: [user1, user2, user3],
            athletes: [athlete1, athlete2],
        })
        try {
            const athlete = await Athletes.readOne(100)
            expect(athlete).toEqual(null)
        } finally {
            await destroyAthleteModel(Athletes)
        }
    })
})
