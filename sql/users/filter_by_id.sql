SELECT users.id as user_id, users.first_name, users.last_name, users.email, athletes.id as athlete_id FROM users 
INNER JOIN athletes
    ON athletes.user_id = users.id
WHERE users.id = %1$L;
