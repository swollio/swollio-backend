INSERT INTO workouts (team_id, name, repeat, start_date, end_date)
VALUES (%1$L, %2$L, %3$L, %4$L, %5$L)
RETURNING id