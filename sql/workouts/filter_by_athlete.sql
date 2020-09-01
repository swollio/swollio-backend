WITH exercises AS (
    SELECT
        exercises.id,
        exercises.name,
        (
	        SELECT COALESCE(
	            ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(muscles))), 
	            '[]'::json
	        ) FROM muscles 
	        INNER JOIN muscles_exercises
	        ON muscle_id = id
	        WHERE exercise_id = exercises.id
        ) as muscles
    FROM exercises
),
workouts_for_athlete AS (
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
		AND athlete_id = %1$L
	) 
	AS completed
	FROM workouts_for_athlete
),
workout_with_assignments as (
	SELECT id as workout_id, date, workout_name AS name, team_name, completed, (
		SELECT COALESCE(
		    ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT(
		        'id', assignments.id,
		        'exercise', exercises,
		        'rep_count', assignments.rep_count
		    ))), 
		    '[]'::json
		) AS assignments
		FROM assignments
		INNER JOIN exercises
		ON exercises.id = assignments.exercise_id
		RIGHT JOIN workouts_for_athlete_completed
		ON workouts_for_athlete_completed.id = assignments.workout_id
	)
	FROM workouts_for_athlete_completed as athlete_workouts
) SELECT workout_id, date, ARRAY_TO_JSON(ARRAY_AGG(JSON_BUILD_OBJECT(
	'name', name,
	'team_name', team_name,
	'completed', completed,
	'assignments', assignments))) AS workouts
FROM workout_with_assignments
WHERE date >= CURRENT_DATE
GROUP BY date, workout_id;