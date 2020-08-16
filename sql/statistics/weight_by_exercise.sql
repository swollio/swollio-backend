WITH results AS (
	SELECT exercise_id, date, SUM(weight * reps) / SUM(reps) as avg_weight FROM WORKOUT_RESULTS 
	WHERE athlete_id=%1$L
	GROUP BY (exercise_id, date)
	ORDER BY date
), grouped_results AS (
	SELECT exercise_id, json_agg(results) as weight_series FROM results
	GROUP BY exercise_id
) 

SELECT exercises.name as exercise_name, grouped_results.* 
FROM grouped_results
INNER JOIN exercises
ON exercises.id=grouped_results.exercise_id;
