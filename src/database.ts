import { Pool } from 'pg'
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


glob("sql/**/*.sql").then(files => {
  let queries = new Map<string, string>();
  files.forEach(file => {
    const data = fs.readFileSync(file);
    const key = file.split('.')[0].split('/').slice(1).join('.');
    console.log(key)
    queries = queries.set(key, data.toString());
  });
  return queries;
}).then(queries => {
  console.log(queries);
});

export {pool}