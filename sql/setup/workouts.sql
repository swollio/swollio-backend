-- Creates our workouts table --
CREATE TABLE IF NOT EXISTS workouts (
	id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
    name TEXT NOT NULL,
    repeat TEXT NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);