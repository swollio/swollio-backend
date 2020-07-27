SELECT athletes.* FROM athletes
INNER JOIN athletes_teams
	ON athletes.id = athletes_teams.athlete_id
WHERE athletes_teams.team_id = %1$L;