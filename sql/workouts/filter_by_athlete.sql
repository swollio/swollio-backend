WITH week_starts AS (
	SELECT DATE_TRUNC('week', CURRENT_DATE) + s.a * '1 week'::interval AS week_start FROM GENERATE_SERIES(0, 3) AS s(a)
), upcoming AS (
	SELECT workouts.id, (week_start + unnest(workouts.repeat) * '1 day'::interval) as date,
		teams.name AS team_name,
		workouts.id AS workout_id,
		workouts.name AS workout_name,
		workouts.start_date,
		workouts.end_date FROM workouts
	INNER JOIN athletes_teams
		ON workouts.team_id = athletes_teams.team_id
	INNER JOIN teams
		ON workouts.team_id = teams.id
	CROSS JOIN week_starts
	WHERE (athlete_id = %1$L)
	-- Start before the week ends and end before the week starts -
), upcoming_completed AS (
	SELECT upcoming.*, 
	EXISTS(
		SELECT 1 
		FROM workout_surveys 
		WHERE workout_id = upcoming.workout_id 
		AND due_date = upcoming.date 
		AND athlete_id = %1$L) 
	AS completed
	FROM upcoming
)

SELECT date, ARRAY_AGG(ROW_TO_JSON(upcoming_completed)) as workouts FROM upcoming_completed
WHERE (start_date <= date AND end_date >= date)
	AND date >= CURRENT_DATE
GROUP BY date
ORDER BY date ASC;