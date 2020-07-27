WITH primary_muscles AS (
    SELECT muscles.id FROM muscles
    INNER JOIN muscles_exercises 
        ON muscles_exercises.muscle_id = muscles.id
    WHERE exercise_id = %1$L
), similar_exercises AS (
    SELECT exercise_id AS id, COUNT(muscle_id) AS similarity FROM muscles_exercises
    INNER JOIN primary_muscles
        ON primary_muscles.id = muscle_id
    WHERE exercise_id <> %1$L
    GROUP BY exercise_id
)

SELECT similar_exercises.id, name, similarity
FROM similar_exercises
INNER JOIN exercises
	ON exercises.id = similar_exercises.id
ORDER BY similarity DESC
LIMIT 10