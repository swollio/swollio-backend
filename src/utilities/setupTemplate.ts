import util from "util"
import { exec } from "child_process"
import { Client } from "pg"
import sql from "sql-template-strings"

async function setupUsers(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE,
            hash TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create users table: ${error.message}`)
    }
}

async function setupAthletes(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS athletes (
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            age INT,
            height INT,
            weight INT,
            gender TEXT
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create athletes table: ${error.message}`)
    }
}

async function setupTeams(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            pin INT UNIQUE,
            name TEXT NOT NULL,
            coach_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            sport TEXT,
            created TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create teams table: ${error.message}`)
    }
}

async function setupTeamTags(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS team_tags (
            id SERIAL PRIMARY KEY,
            team_id INT REFERENCES teams(id) ON DELETE CASCADE,
            tag TEXT NOT NULL
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create team_tags table: ${error.message}`)
    }
}

async function setupExercises(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS exercises (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            team_id INT DEFAULT NULL REFERENCES teams(id) ON DELETE CASCADE
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupMuscles(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS muscles (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            nickname TEXT NOT NULL,
            region TEXT NOT NULL
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupMuscleExercises(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS muscles_exercises (
            muscle_id INT NOT NULL REFERENCES muscles(id)  ON DELETE CASCADE,
            exercise_id INT NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,
        
            PRIMARY KEY (muscle_id, exercise_id)
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupWorkouts(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS workouts (
            id SERIAL PRIMARY KEY,
            team_id INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
            name TEXT NOT NULL,
            created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            dates TIMESTAMPTZ[] NOT NULL
        );
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupAssignments(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS assignments (
            id SERIAL PRIMARY KEY,
            workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
            exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
            rep_count INT[] NOT NULL
        );        
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupWorkoutTeamTags(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS workout_team_tags(
            workout_id INT NOT NULL,
            team_tag_id INT NOT NULL,
        
            FOREIGN KEY (workout_id)
            REFERENCES workouts(id),
        
            FOREIGN KEY (team_tag_id)
            REFERENCES team_tags(id)
        );       
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupAthletesTeams(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS athletes_teams (
            athlete_id INT NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
            team_id INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
            
            PRIMARY KEY (athlete_id, team_id)
        );      
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupAthleteTeamTags(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS athlete_team_tags(
            athlete_id INT REFERENCES athletes(id) ON DELETE CASCADE,
            team_tag_id INT REFERENCES team_tags(id) ON DELETE CASCADE,
            
            PRIMARY KEY (athlete_id, team_tag_id)
        );              
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupWorkoutResults(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS workout_results (
            id SERIAL PRIMARY KEY,
            athlete_id INT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
            exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
            assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
            workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
            weight INT NOT NULL,
            reps INT NOT NULL,
            date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE,
            created TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );             
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

async function setupWorkoutSurveys(client: Client) {
    try {
        await client.query(sql`
        CREATE TABLE IF NOT EXISTS workout_surveys (
            athlete_id INT REFERENCES athletes(id) ON DELETE CASCADE ON UPDATE CASCADE,
            workout_id INT REFERENCES workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
            due_date TIMESTAMPTZ NOT NULL,
            rating NUMERIC, -- 1-5,
            hours_sleep INT, -- Sleep for the day
            wellness INT -- General wellness after workout on a scale of 1-5
        );             
        `)
    } catch (error) {
        throw new Error(`Unable to create exercises table: ${error.message}`)
    }
}

/**
 * This function creates a swollio-template database and populates it
 * with all of the tables that the swollio backend needs
 */
async function setupTemplateDb(): Promise<void> {
    await util.promisify(exec)("dropdb swollio-template --if-exists")
    await util.promisify(exec)("createdb swollio-template")

    const client = new Client({
        database: "swollio-template",
    })

    try {
        // Connect to new client
        await client.connect()

        // Add all of the tables
        await setupUsers(client)
        await setupAthletes(client)
        await setupTeams(client)
        await setupTeamTags(client)
        await setupExercises(client)
        await setupMuscles(client)
        await setupMuscleExercises(client)
        await setupWorkouts(client)
        await setupAssignments(client)
        await setupWorkoutTeamTags(client)
        await setupAthletesTeams(client)
        await setupAthleteTeamTags(client)
        await setupWorkoutResults(client)
        await setupWorkoutSurveys(client)
    } finally {
        client.end()
    }
}

setupTemplateDb().then(() => console.log("Template database is setup!"))
