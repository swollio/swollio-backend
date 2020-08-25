import * as TestDatabase from "../../utilities/testDatabase"
import UserModel from "../user"

const database = "test:models:users"

async function createUserModel(mockData: TestDatabase.MockData) {
    const client = await TestDatabase.create(database, mockData)
    const Users = new UserModel(client)
    return Users
}

async function destroyUserModel(Users: UserModel) {
    await Users.client.end()
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

describe("UserModel.createOne", () => {
    /*
     * Users.createOne should store the new user in the users table
     * of the database.
     */
    it("should store a new user in the database", async () => {
        const Users = await createUserModel({})
        try {
            await Users.createOne(user1)
            const result = await Users.client.query(
                `SELECT id, first_name, last_name, email, hash FROM users`
            )
            expect(result.rows).toEqual([user1])
        } finally {
            await destroyUserModel(Users)
        }
    })

    /*
     * We require that all user accounts must have unique emails.
     * This test enforces that the model fails to create a user
     * with a duplicate email.
     */
    it("should throw when attempting to create duplicate user", async () => {
        const Users = await createUserModel({})
        try {
            await Users.createOne(user1)
            await expect(Users.createOne(user4)).rejects.toThrow()
        } finally {
            await destroyUserModel(Users)
        }
    })
})

describe("UserModel.readOne", () => {
    it("should return user1 when called with id=1", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOne(1)
            expect(user).toEqual(user1)
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should return user2 when called with id=2", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOne(2)
            expect(user).toEqual(user2)
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should return null when called with non-existant id", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOne(100)
            expect(user).toEqual(null)
        } finally {
            await destroyUserModel(Users)
        }
    })
})

describe("UserModel.readOneByEmail", () => {
    it("should return user1 when called with email=user1.email", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOneByEmail(user1.email)
            expect(user).toEqual(user1)
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should return user2 when called with email=user2.email", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOneByEmail(user2.email)
            expect(user).toEqual(user2)
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should return null when called with non-existant id", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const user = await Users.readOneByEmail("nonexistant@mail.com")
            expect(user).toEqual(null)
        } finally {
            await destroyUserModel(Users)
        }
    })
})

describe("UserModel.readAll", () => {
    it("should return all users", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            const users = await Users.readAll()
            expect(users).toEqual([user1, user2, user3])
        } finally {
            await destroyUserModel(Users)
        }
    })
})

describe("UserModel.update", () => {
    it("should successfully update first_name ", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.update({
                id: 1,
                first_name: "test",
            })
            const result = await Users.client.query(
                "SELECT first_name FROM users WHERE id=1"
            )
            expect(result.rows[0].first_name).toEqual("test")
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should successfully update last_name ", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.update({
                id: 1,
                last_name: "test",
            })
            const result = await Users.client.query(
                "SELECT last_name FROM users WHERE id=1"
            )
            expect(result.rows[0].last_name).toEqual("test")
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should successfully update email ", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.update({
                id: 1,
                email: "test@mail.com",
            })
            const result = await Users.client.query(
                "SELECT email FROM users WHERE id=1"
            )
            expect(result.rows[0].email).toEqual("test@mail.com")
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should throw when updating email violates email uniqueness constraint", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await expect(
                Users.update({
                    id: 1,
                    email: "dmalfoy@slytherin.com",
                })
            ).rejects.toThrow()

            const result = await Users.client.query(
                "SELECT email FROM users WHERE id=1"
            )
            expect(result.rows[0].email).toEqual("hpotter@gryffindor.com")
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should successfully update hash", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.update({
                id: 1,
                hash:
                    "$2y$10$/gay/noVkqrqpoMNm8HqjucZzB7sRwP9.KS6PfeRnrZnRMmxKIVOe",
            })

            const result = await Users.client.query(
                "SELECT hash FROM users WHERE id=1"
            )
            expect(result.rows[0].hash).toEqual(
                "$2y$10$/gay/noVkqrqpoMNm8HqjucZzB7sRwP9.KS6PfeRnrZnRMmxKIVOe"
            )
        } finally {
            await destroyUserModel(Users)
        }
    })

    it("should successfully update multiple fields at once", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.update({
                id: 1,
                first_name: "harold",
                hash:
                    "$2y$10$/gay/noVkqrqpoMNm8HqjucZzB7sRwP9.KS6PfeRnrZnRMmxKIVOe",
            })

            const result = await Users.client.query(
                "SELECT first_name, hash FROM users WHERE id=1"
            )
            expect(result.rows[0]).toEqual({
                first_name: "harold",
                hash:
                    "$2y$10$/gay/noVkqrqpoMNm8HqjucZzB7sRwP9.KS6PfeRnrZnRMmxKIVOe",
            })
        } finally {
            await destroyUserModel(Users)
        }
    })
})

describe("UserModel.destroy", () => {
    it("should successfully delete user", async () => {
        const Users = await createUserModel({ users: [user1, user2, user3] })
        try {
            await Users.destroy(1)
            const result = await Users.client.query("SELECT id FROM users")
            expect(result.rows).toEqual([{ id: 2 }, { id: 3 }])
        } finally {
            await destroyUserModel(Users)
        }
    })
})
