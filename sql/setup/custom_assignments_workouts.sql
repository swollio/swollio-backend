CREATE TABLE IF NOT EXISTS custom_assignments_workouts (
    custom_assignment_id INT NOT NULL REFERENCES custom_assignments(id)  ON DELETE CASCADE,
    workout_id INT NOT NULL REFERENCES workouts(id)  ON DELETE CASCADE
);