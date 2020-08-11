import app from './app'
import db from './utilities/database'

import users from './mock/users.json'
import athletes from './mock/athletes.json'
import teams from './mock/teams.json'
import athletes_teams_tags from './mock/athletes_teams_tags.json'
import muscles from './mock/muscles.json'
import equipment from './mock/equipment.json'
import exercises from './mock/exercises.json'
import equipment_exercises from './mock/equipment_exercises.json'
import muscles_exercises from './mock/muscles_exercises.json'
import tags from './mock/tags.json'

/**
 * Creates all of the tables in the database and populates tables given by
 * mock objects
 */
async function setupDatabase() {
  await db['setup.users']();
  await db['setup.athletes']();
  await db['setup.teams']();
  await db['setup.tags']();

  await db['setup.exercises']();
  await db['setup.equipment']();
  await db['setup.equipment_exercises']();
  await db['setup.muscles']();
  await db['setup.muscles_exercises']();

  await db['setup.workouts']();
  await db['setup.assignments']();
  await db['setup.custom_assignments']();

  await db['setup.workout_tags']();
  await db['setup.athletes_equipment']();
  await db['setup.athletes_teams']();
  await db['setup.athletes_teams_tag']();
  
  await db['setup.workout_results'](); 

  // Initializing mock data
  for (const user of users) {
    await db['users.signup']([user.first_name, user.last_name, user.email, user.hash]);
  }

  for (const team of teams) {
    await db['teams.add_one']([team.name, team.sport, team.coach_id]);
  }

  for (const athlete of athletes) {
    await db['athletes.add_one']([athlete.user_id, athlete.age, athlete.height, athlete.weight, athlete.gender]);
    await db['teams.add_athlete']([1, athlete.id]);
  }

  for (const tag of tags) {
    await db['tags.add_tag']([tag.tag]);
  }

  for (const tagInfo of athletes_teams_tags) {
    await db['athletes_teams_tags.add_one']([tagInfo.athlete_id, tagInfo.team_id, tagInfo.tag_id]);
  }

  for (const muscle of muscles) {
    await db['exercises.add_muscles']([muscle.name, muscle.nickname, muscle.region]);
  }

  for (const exercise of exercises) {
    await db['exercises.add_exercises']([exercise.name, exercise.weight, exercise.reps, exercise.legitimacy]);
  }

  for (const equip of equipment) {
    await db['exercises.add_equipment']([equip.name]);
  }

  for (const muscle_exercise of muscles_exercises) {
    await db['exercises.add_muscles_exercises']([muscle_exercise.muscle_id, muscle_exercise.exercise_id]);
  }
  
  for (const equipment_exercise of equipment_exercises) {
    await db['exercises.add_equipment_exercises']([equipment_exercise.equipment_id, equipment_exercise.exercise_id]);
  }
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});