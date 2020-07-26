CREATE TABLE IF NOT EXISTS muscles_exercises (
    muscle_id INT NOT NULL REFERENCES muscles(id)  ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,

    PRIMARY KEY (muscle_id, exercise_id)
);