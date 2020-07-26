SELECT id, workouts.name, workouts.created, repeat FROM workouts
WHERE team_id = %1$L;