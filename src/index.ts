import app from './app'
import db from './utilities/database'

import muscles from './mock/muscles.json'
import equipment from './mock/equipment.json'
import exercises from './mock/exercises.json'
import equipment_exercises from './mock/equipment_exercises.json'
import muscles_exercises from './mock/muscles_exercises.json'

async function setupDatabase() {
  await db['setup.users']();
  await db['setup.athletes']();
  await db['setup.teams']();

  await db['setup.exercises']();
  await db['setup.equipment']();
  await db['setup.equipment_exercises']();
  await db['setup.muscles']();
  await db['setup.muscles_exercises']();

  await db['setup.workouts']();
  await db['setup.assignments']();
  await db['setup.custom_assignments']();

  await db['setup.athletes_equipment']();
  await db['setup.athletes_teams']();
  await db['setup.athletes_teams_tag']();
  
  await db['setup.workout_results'](); 

  for (const m of muscles) {
    await db['exercises.add_muscles']([m.name, m.nickname, m.region]);
  }

  for (const e of exercises) {
    await db['exercises.add_exercises']([e.name, e.weight, e.reps, e.legitimacy]);
  }

  for (const e of equipment) {
    await db['exercises.add_equipment']([e.name]);
  }

  for (const x of muscles_exercises) {
    await db['exercises.add_muscles_exercises']([x.muscle_id, x.exercise_id]);
  }
  
  for (const x of equipment_exercises) {
    await db['exercises.add_equipment_exercises']([x.equipment_id, x.exercise_id]);
  }

}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});