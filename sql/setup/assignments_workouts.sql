CREATE TABLE IF NOT EXISTS assignments_workouts (
    assignment_id INT NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES equipment(id)  ON DELETE CASCADE
);