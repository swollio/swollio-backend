-- Gets all the tags for a given athlete on a given team --
SELECT tag_id AS id, tags.tag
FROM athletes_teams_tags
INNER JOIN tags
ON athletes_teams_tags.tag_id=tags.id
WHERE athletes_teams_tags.athlete_id=%1$L
AND athletes_teams_tags.team_id=%2$L;