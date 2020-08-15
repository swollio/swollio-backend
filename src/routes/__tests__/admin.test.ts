import express from "express"
import router from "../admin"
import db from "../../utilities/database"
import * as constants from "../../utilities/constants"

const app = express()
app.use("/", router)

beforeAll(() => {
    return async () => {
        // Instantiating all tables
        await db["exercises.instantiate"]()

        // Populating muscles array with muscles
        constants.muscles.forEach((muscle) => {
            db.insert_muscles([muscle.name])
        })
    }
})

afterAll(() => {
    return async () => {
        await db["exercises.teardown"]()
    }
})

// Not quite sure what tests to do here, but we are getting somewhere!
