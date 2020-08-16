SELECT users.id as user_id, users.first_name, users.last_name, users.email, teams.id AS team_id, athletes.id AS athlete_id, teams.pin AS pin FROM users 
LEFT JOIN teams
    ON teams.coach_id = users.id
LEFT JOIN athletes
    ON athletes.user_id = users.id
WHERE users.id =  %1$L;