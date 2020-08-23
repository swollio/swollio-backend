import util from "util"
import { exec } from "child_process"
import sql from "sql-template-strings"

import { Client } from "pg"

import Exercise from "../schema/exercise"
import Muscle from "../schema/muscle"

const TEMPLATE_DATABASE = "swollio-template"

export async function createTestDatabase(
    database: string,
    mockData: { muscles: Muscle[]; exercises: Exercise[] }
): Promise<void> {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
    await util.promisify(exec)(
        `createdb ${database} --template=${TEMPLATE_DATABASE}`
    )

    const client = new Client({
        host: "localhost",
        database,
    })
    try {
        await client.connect()
        await client.query(sql`
            INSERT INTO muscles SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::muscles, ${JSON.stringify(
                mockData.muscles
            )})
        `)
        await client.query(sql`
            INSERT INTO exercises SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::exercises, ${JSON.stringify(
                mockData.exercises
            )})
        `)
    } catch (err) {
        console.log(err.toString())
    } finally {
        client.end()
    }
}

export async function destroyTestDatabase(database: string): Promise<void> {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
}
