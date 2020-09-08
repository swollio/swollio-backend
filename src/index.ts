/* eslint-disable */
import app from "./app"
import db from "./utilities/database"

import users from "./mock/users.json"
import athletes from "./mock/athletes.json"
import teams from "./mock/teams.json"
import muscles from "./mock/muscles.json"
import exercises from "./mock/exercises.json"
import musclesExercise from "./mock/muscles_exercises.json"
import teamTags from "./mock/team_tags.json"
import athleteTeamTags from "./mock/athletes_teams_tags.json"
import signup from "./workflows/auth/signup"
import addAthlete from "./workflows/athlete/addAthlete"

/**
 * Creates all of the tables in the database and populates tables given by
 * mock objects
 */
async function setupDatabase() {
    await db["setup.users"]()
    await db["setup.athletes"]()
    await db["setup.teams"]()
    await db["setup.team_tags"]()

    await db["setup.exercises"]()
    await db["setup.muscles"]()
    await db["setup.muscles_exercises"]()

    await db["setup.workouts"]()
    await db["setup.assignments"]()

    await db["setup.workout_team_tags"]()
    await db["setup.athletes_teams"]()
    await db["setup.athlete_team_tags"]()

    await db["setup.workout_results"]()
    await db["setup.workout_surveys"]()

    // Initializing mock data
    for (const user of users) {
        await signup(user)
    }

    for (const team of teams) {
        await db["teams.add_one"]([
            team.name,
            team.sport,
            team.coach_id,
            team.pin,
        ])
    }

    for (let i = 0; i < athletes.length; i++) {
        const pin = i < 5 ? 420690 : 314159
        await addAthlete(athletes[i], pin)
    }

    // Add this later
    // for (const tagInfo of athletes_teams_tags) {
    //   await db['tags.add_athlete_tag']([tagInfo.athlete_id, tagInfo.team_id, tagInfo.tag_id]);
    // }

    for (const muscle of muscles) {
        await db["exercises.add_muscles"]([
            muscle.name,
            muscle.nickname,
            muscle.region,
        ])
    }

    for (const exercise of exercises) {
        await db["exercises.add_exercises"]([
            exercise.name,
            exercise.weight,
            exercise.reps,
            exercise.legitimacy,
        ])
    }

    await db["exercises.add_muscles_exercises"]([
        musclesExercise.map((x) => [x.muscle_id, x.exercise_id]),
    ])

    for (const teamTag of teamTags) {
        await db["tags.add_team_tag"]([teamTag.team_id, teamTag.tag])
    }

    for (const athleteTeamTag of athleteTeamTags) {
        await db["tags.add_athlete_tag"]([
            athleteTeamTag.athlete_id,
            athleteTeamTag.team_tag_id,
        ])
    }
}


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    console.log("Press Ctrl+C to quit.")
})
