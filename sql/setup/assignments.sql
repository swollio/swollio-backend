CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(id)  ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,
    rep_count INT[] NOT NULL,
    weight_scheme TEXT NOT NULL
);