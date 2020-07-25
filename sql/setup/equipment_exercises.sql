CREATE TABLE IF NOT EXISTS equipment_exercises (
    equipment_id INT NOT NULL REFERENCES equipment(id)  ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,

    PRIMARY KEY (equipment_id, exercise_id)
);