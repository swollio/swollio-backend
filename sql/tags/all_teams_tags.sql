-- Lists all the tags a team has --
SELECT tags.tag FROM tags
INNER JOIN athletes_teams_tags
ON athletes_teams_tags.team_id = %1$L
GROUP BY tags.tag;