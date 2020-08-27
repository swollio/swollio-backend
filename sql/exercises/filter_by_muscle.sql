SELECT exercises.* FROM exercises
INNER JOIN muscles_exercises 
	ON muscles_exercises.exercise_id = exercises.id
INNER JOIN muscles
	ON muscles_exercises.muscle_id = muscles.id
WHERE muscles.nickname = $1
GROUP BY exercises.id;