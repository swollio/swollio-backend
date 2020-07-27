INSERT INTO workouts (team_id, name, repeat)
VALUES (%1$L, %2$L, %3$L)
RETURNING id