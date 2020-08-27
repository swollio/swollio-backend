INSERT INTO users
(first_name, last_name, email, hash)
VALUES (%1$L, %2$L, %3$L, %4$L)
RETURNING id;