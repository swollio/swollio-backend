INSERT INTO workouts (team_id, name, dates)
VALUES (%1$L, %2$L, %3$L)
RETURNING id