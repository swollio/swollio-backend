-- Add workout tag to workout_tags table --
INSERT INTO workout_team_tags(workout_id, team_tag_id)
VALUES (%1$L, %2$L);