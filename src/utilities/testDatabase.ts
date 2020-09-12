import util from "util"
import { exec } from "child_process"
import sql from "sql-template-strings"

import { Client } from "pg"

import * as Exercise from "../models/exercise"
import * as Workout from "../models/workout"
import * as User from "../models/user"
import * as Athlete from "../models/athlete"
import * as Team from "../models/team"

const TEMPLATE_DATABASE = "swollio-template"

export interface MockData {
    muscles?: Exercise.MuscleRow[]
    exercises?: Exercise.ExerciseRow[]
    musclesExercises?: Exercise.MusclesExerciseRow[]
    assignments?: Workout.AssignmentRow[]
    workouts?: Workout.WorkoutRow[]
    users?: User.UserRow[]
    teams?: Team.TeamRow[]
    athletes?: Athlete.AthleteRow[]
    athletesTeams?: Workout.AthleteTeamsRow[]
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
    try {
        await client.connect()

        // Bulk insert all mock users data if it exists
        if (mockData.users !== undefined) {
            await client.query(sql`
            INSERT INTO users (id, first_name, last_name, email, hash)
            SELECT id, first_name, last_name, email, hash FROM 
            JSON_POPULATE_RECORDSET(NULL::users, ${JSON.stringify(
                mockData.users
            )})
        `)
        }

        // Bulk insert all mock teams data if it exists
        if (mockData.teams !== undefined) {
            await client.query(sql`
            INSERT INTO teams (id, pin, name, coach_id, sport)
            SELECT id, pin, name, coach_id, sport FROM 
            JSON_POPULATE_RECORDSET(NULL::teams, ${JSON.stringify(
                mockData.teams
            )})
        `)
        }

        // Bulk insert all mock teams data if it exists
        if (mockData.athletes !== undefined) {
            await client.query(sql`
            INSERT INTO athletes (id, user_id, age, height, weight, gender)
            SELECT id, user_id, age, height, weight, gender FROM 
            JSON_POPULATE_RECORDSET(NULL::athletes, ${JSON.stringify(
                mockData.athletes
            )})
        `)
        }

        // Insert all mock athlete_teams
        if (mockData.athletesTeams !== undefined) {
            await client.query(sql`
            INSERT INTO athletes_teams (team_id, athlete_id)
            SELECT team_id, athlete_id FROM 
            JSON_POPULATE_RECORDSET(NULL::athletes_teams, ${JSON.stringify(
                mockData.athletesTeams
            )})
            `)
        }

        // Bulk insert all mock muscle data if it exists
        if (mockData.muscles !== undefined) {
            await client.query(sql`
            INSERT INTO muscles SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::muscles, ${JSON.stringify(
                mockData.muscles
            )})
        `)
        }

        // Bulk insert all mock exercise data if it exists
        if (mockData.exercises !== undefined) {
            await client.query(sql`
            INSERT INTO exercises SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::exercises, ${JSON.stringify(
                mockData.exercises
            )})
        `)
        }

        // Bulk insert all mock musclesExercises data if it exists
        if (mockData.musclesExercises !== undefined) {
            await client.query(sql`
            INSERT INTO muscles_exercises SELECT * FROM 
            JSON_POPULATE_RECORDSET(NULL::muscles_exercises, ${JSON.stringify(
                mockData.musclesExercises
            )})
        `)
        }

        // Bulk insert all mock workouts data if it exists
        if (mockData.workouts !== undefined) {
            await client.query(sql`
            INSERT INTO workouts (id, team_id, athlete_id, name, dates) 
            SELECT id, team_id, athlete_id, name, dates FROM 
            JSON_POPULATE_RECORDSET(NULL::workouts, ${JSON.stringify(
                mockData.workouts
            )})
        `)
        }

        // Bulk insert all mock assignments data if it exists
        if (mockData.assignments !== undefined) {
            await client.query(sql`
            INSERT INTO assignments (id, workout_id, exercise_id, rep_count)
            SELECT id, workout_id, exercise_id, rep_count FROM 
            JSON_POPULATE_RECORDSET(NULL::assignments, ${JSON.stringify(
                mockData.assignments
            )})
        `)
        }
    } catch (err) {
        console.log(err)
    }
    return client
}

export async function destroy(database: string): Promise<void> {
    await util.promisify(exec)(`dropdb ${database} --if-exists`)
}
