SELECT * FROM users
INNER JOIN users_teams
    ON users.id = users_teams.user_id
WHERE users_teams.team_id = %L;