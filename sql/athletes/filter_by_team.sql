-- Gets all of the athletes and tags with the given team id --
WITH athlete_tags AS (
	SELECT athlete_team_tags.athlete_id, team_tags.tag
	FROM team_tags
	INNER JOIN athlete_team_tags
		ON team_tag_id = id
	WHERE team_id = 2
)
SELECT athletes.id, first_name, last_name, age, height, weight, gender, ARRAY_AGG(tag) AS tags
FROM athletes INNER JOIN athletes_teams
	ON athletes.id = athletes_teams.athlete_id
INNER JOIN users
	ON athletes.user_id = users.id
LEFT JOIN athlete_tags
	ON athletes.id = athlete_tags.athlete_id
WHERE athletes_teams.team_id = 2
GROUP BY athletes.id, first_name, last_name, age, height, weight, gender;