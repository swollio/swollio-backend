CREATE TABLE IF NOT EXISTS custom_exercises (
    id SERIAL PRIMARY KEY,
    exercise_id INT NOT NULL REFERENCES exercise.id  ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES team.id  ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    description TEXT NOT NULL,
);