CREATE TABLE IF NOT EXISTS muscles_exercises (
    muscle_id INT NOT NULL REFERENCES muscles.id  ON DELETE CASCADE,
    exercises_id INT NOT NULL REFERENCES exercise.id  ON DELETE CASCADE,

    PRIMARY KEY (muscle_id, exercises_id)
);