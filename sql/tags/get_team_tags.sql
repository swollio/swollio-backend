-- Gets all tags that are on a team --
SELECT tag_id AS id, tags.tag
FROM athletes_teams_tags
INNER JOIN tags
ON athletes_teams_tags.tag_id=tags.id
WHERE athletes_teams_tags.team_id=%1$L
GROUP BY tag_id, tags.tag;