SELECT users.id as user_id, users.first_name, users.last_name, users.email, teams.id as team_id, athletes.id as athlete_id FROM users 
LEFT JOIN teams
    ON teams.coach_id = users.id
LEFT JOIN athletes
    ON athletes.user_id = users.id
WHERE users.id =  %1$L;