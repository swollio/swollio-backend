-- Filters the workouts by tag id --
SELECT workout_tags.workout_id FROM workout_tags
WHERE workout_tags.tag_id = %1$L;