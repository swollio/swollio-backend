CREATE TABLE IF NOT EXISTS assignments_workouts (
    assignment_id INT NOT NULL REFERENCES assignments(id)  ON DELETE CASCADE,
    workout_id INT NOT NULL REFERENCES workouts(id)  ON DELETE CASCADE
);