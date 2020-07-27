SELECT athletes.id, first_name, last_name, age, height, weight, gender FROM athletes
INNER JOIN athletes_teams
	ON athletes.id = athletes_teams.athlete_id
INNER JOIN users
	ON athletes.user_id = users.id
WHERE athletes_teams.team_id = %1$L;