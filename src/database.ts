import { Pool, QueryResult } from 'pg'
import fs from 'fs'
import path from 'path'
import glob from 'glob-promise'

const pool = new Pool({
  user: 'thomasbarrett',
  host: 'localhost',
  database: 'swollio',
  password: 'test123',
  port: 5432,
})

function load_database() {
    let files = glob.sync("sql/**/*.sql")
    var queries: {[key: string]: (values?: any[] | undefined) => Promise<QueryResult<any>> } = {};
    files.forEach(file => {
        const key = file.split('.')[0].split('/').slice(1).join('.');
        const value = fs.readFileSync(file);
        queries[key] = (values?: any[] | undefined) => pool.query(value.toString(), values);
    });
    return queries;
}

const db = load_database();

export default db;