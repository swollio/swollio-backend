-- Filters athletes of a specific team by tags --
-- The first argument is the team id, and the second argument is the tag --
WITH team_tag AS (
	SELECT id FROM team_tags
	WHERE team_id = %1$L AND
		  tag = %2$L
)
SELECT athlete_id FROM athlete_team_tags
INNER JOIN team_tag
ON team_tag.id = team_tag_id;