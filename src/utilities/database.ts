/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool, QueryResult } from "pg"
import fs from "fs"
import glob from "glob-promise"
import format from "pg-format"
import config from "../config.json"

const pool = new Pool(config.sql)

/**
 * This function automatically creates an object using the SQL queries in the sql/*.
 * The object key is the name of the file in the directory <entity>.<query-desc>,
 * and the value is a function that runs the query using the PostgreSQL API.
 */
function loadDatabase() {
    const files = glob.sync("sql/**/*.sql")
    const queries: {
        [key: string]: (values?: any[] | undefined) => Promise<QueryResult<any>>
    } = {}
    files.forEach((file) => {
        const key = file.split(".")[0].split("/").slice(1).join(".")
        const query = fs.readFileSync(file, { encoding: "utf8" })
        queries[key] = (values?: any[] | undefined) => {
            return pool.query(format(query, ...(values || [])))
        }
    })

    return queries
}

const db = loadDatabase()
export default db
export { pool }
