-- Gets the id, first_name, last_name, age, height, weight, gender, and tag
-- of every athlete on a given team.
-- Tags are aggregated into an array
WITH athlete_tags AS (
	SELECT athletes_teams_tags.athlete_id, tags.tag
	FROM athletes_teams_tags
	INNER JOIN tags
		ON athletes_teams_tags.tag_id = tags.id
	WHERE team_id = %1$L
)
SELECT athletes.id, first_name, last_name, age, height, weight, gender, ARRAY_AGG(tag) AS tags
FROM athletes
INNER JOIN athletes_teams
	ON athletes.id = athletes_teams.athlete_id
INNER JOIN users
	ON athletes.user_id = users.id
LEFT JOIN athlete_tags
	ON athletes.id = athlete_tags.athlete_id
WHERE athletes_teams.team_id = %1$L
GROUP BY athletes.id, first_name, last_name, age, height, weight, gender;