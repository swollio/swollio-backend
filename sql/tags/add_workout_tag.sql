-- Add workout tag to workout_tags table --
INSERT INTO workout_tags(workout_id, tag_id)
VALUES (%1$L, %2$L);