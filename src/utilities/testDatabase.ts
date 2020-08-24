import util from "util"
import { exec } from "child_process"
import sql from "sql-template-strings"

import { Client } from "pg"

import * as Exercise from "../models/exercise"

const TEMPLATE_DATABASE = "swollio-template"

export interface MockData {
    muscles?: Exercise.MuscleRow[]
    exercises?: Exercise.ExerciseRow[]
}

export async function create(
    database: string,
    mockData: MockData
): Promise<Client> {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
    await util.promisify(exec)(
        `createdb ${database} --template=${TEMPLATE_DATABASE}`
    )

    // Create a SQL client to connect to new database
    const client = new Client({ host: "localhost", database })
    await client.connect()

    // Bulk insert all mock muscle data if it exists
    if (mockData.muscles) {
        await client.query(sql`
            INSERT INTO muscles SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::muscles, ${JSON.stringify(
                mockData.muscles
            )})
        `)
    }

    // Bulk insert all mock exercise data if it exists
    if (mockData.exercises) {
        await client.query(sql`
            INSERT INTO exercises SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::exercises, ${JSON.stringify(
                mockData.exercises
            )})
        `)
    }

    return client
}

export async function destroy(database: string): Promise<void> {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
}
