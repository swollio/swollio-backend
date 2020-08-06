SELECT id, name, created FROM workouts

SELECT workouts.id, teams.name as team_name, workouts.name as workout_name, workouts.created, workouts.repeat FROM workouts
INNER JOIN athletes_teams
	ON workouts.team_id = athletes_teams.team_id
INNER JOIN teams
	ON workouts.team_id = teams.id
WHERE athlete_id = %1$L;
