CREATE TABLE IF NOT EXISTS workout_surveys (
    athlete_id INT REFERENCES athletes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    workout_id INT REFERENCES workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    due_date TIMESTAMPTZ NOT NULL,
    difficulty INT
);