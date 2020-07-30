-- Gets all tags for a sport --
SELECT athletes_teams_tags.tag_id FROM 
	(SELECT teams.id FROM teams
	 WHERE teams.sport = %1$L)
AS team_ids
INNER JOIN athletes_teams_tags
ON athletes_teams_tags.team_id = team_ids.id
GROUP BY tag_id;
