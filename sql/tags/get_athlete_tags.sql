-- Gets all the tags for a given athlete on a given team --
-- The first argument is the athlete id, and the second 
-- argument is their team id --
WITH all_team_tags AS (
	SELECT team_tag_id FROM athlete_team_tags
	WHERE athlete_id = %1$L 
)
SELECT id, tag FROM team_tags
INNER JOIN all_team_tags
ON team_tag_id=id
WHERE team_id=%2$L;