import app from './app'
import db from './utilities/database'

async function setupDatabase() {
  await db['setup.users']();
  await db['setup.athletes']();
  await db['setup.users_athletes']();
  await db['setup.teams']();
  await db['setup.users_teams']();

  await db['setup.exercises']();
  await db['setup.equipment']();
  await db['setup.equipment_exercises']();
  await db['setup.muscles']();
  await db['setup.muscles_exercises']();

  await db['setup.workouts']();
  await db['setup.assignments']();
  await db['setup.assignments_workouts']();
  await db['setup.custom_assignments']();
  await db['setup.custom_assignments_workouts']();

  await db['setup.athletes_equipment']();
  await db['setup.athletes_teams']();
  await db['setup.athletes_teams_tag']();
  
  await db['setup.workout_results'](); 
}

setupDatabase().then(() => {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
  });
}).catch(error => {
  console.log(error);
})
