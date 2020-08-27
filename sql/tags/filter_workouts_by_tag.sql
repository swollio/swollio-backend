-- Filters the workouts by team_tag --
SELECT workout_id FROM workout_team_tags
WHERE team_tag_id= %1$L;