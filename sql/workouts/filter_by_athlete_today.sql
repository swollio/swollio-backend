WITH workouts_for_athlete AS (
	SELECT 
		workouts.id,
		unnest(workouts.dates) as date,
		workouts.name AS workout_name,
		teams.name AS team_name
	FROM workouts
	INNER JOIN athletes_teams
		ON workouts.team_id = athletes_teams.team_id
	INNER JOIN teams
		ON workouts.team_id = teams.id
	WHERE athlete_id = %1$L
), workouts_for_athlete_completed AS (
	SELECT workouts_for_athlete.*, 
	EXISTS(
		SELECT 1 
		FROM workout_surveys 
		WHERE id = workouts_for_athlete.id 
		AND due_date = workouts_for_athlete.date 
		AND athlete_id = %1$L) 
	AS completed
	FROM workouts_for_athlete
)

SELECT * FROM workouts_for_athlete_completed
WHERE date = CURRENT_DATE;
