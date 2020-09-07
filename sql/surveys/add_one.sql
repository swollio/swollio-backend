-- Adds a workout survey to the workouts_survey database --
INSERT INTO workout_surveys (athlete_id, workout_id, due_date, difficulty)
VALUES (%1$L, %2$L, %3$L, %4$L);