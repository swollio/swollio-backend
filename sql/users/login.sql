SELECT email, first_name, last_name, hash
FROM users
WHERE email=$1
LIMIT 1