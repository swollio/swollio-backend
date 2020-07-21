SELECT (id, name)
FROM exercises
INNER JOIN exercises_muscles
ON exercises.id = exercises_muscles.exercise_id
WHERE exercises_muscles.muscle_id = $1;