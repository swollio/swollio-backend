CREATE TABLE IF NOT EXISTS custom_assignments (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    description TEXT NOT NULL,
    rep_count INT NOT NULL,
    weight_scheme TEXT NOT NULL
);