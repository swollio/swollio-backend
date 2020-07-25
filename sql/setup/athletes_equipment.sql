CREATE TABLE IF NOT EXISTS athletes_equipment (
    athlete_id INT NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
    equipment_id INT NOT NULL REFERENCES equipment(id)  ON DELETE CASCADE
);