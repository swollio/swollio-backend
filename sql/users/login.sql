SELECT id, email, first_name, last_name, hash
FROM users
WHERE email=%1$L
LIMIT 1