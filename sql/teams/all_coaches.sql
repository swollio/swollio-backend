
SELECT users.id, first_name, last_name FROM users
INNER JOIN teams
    ON  users.id = teams.coach_id
WHERE teams.id = %1$L;