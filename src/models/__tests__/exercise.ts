import util from 'util'
import { exec } from 'child_process'
import { Pool } from "pg"

async function createTestDatabase(database: string, data: any) {
    await util.promisify(exec)(`dropdb ${database} --if-exists`) 
    await util.promisify(exec)(`createdb ${database} --no-password`) 
}

async function destroyTestDatabase(database: string) {
    await util.promisify(exec)(`dropdb ${database}`) 
}

import ExerciseModel from '../exercise'
const database = 'tests:models:exercises'
const pool = new Pool({
    host: 'localhost',
    database,
});

const Exercises = new ExerciseModel(pool);

beforeAll(async () => {
    await createTestDatabase(database, {
        muscles: [],
        exercises: [],
    });
});

describe("ExerciseModel.all", () => {
    
    test("it should return []", () => {
        expect(Exercises.all()).toEqual([]);
    });

    test("it should return []", () => {
        expect(Exercises.all()).toEqual([]);
    });

});

afterAll(async () => {
    await pool.end();
    await destroyTestDatabase(database);
});
