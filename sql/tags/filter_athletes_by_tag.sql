-- Filters athletes of a specific team by tags --
-- The first argument is the team id, and the second argument is the tag --
SELECT filtered_teams.athlete_id FROM (
	SELECT * FROM athletes_teams_tags
	WHERE athletes_teams_tags.team_id = %1$L
) AS filtered_teams
WHERE filtered_teams.tag_id = %2$L;