-- Creates a new team_tags table --
CREATE TABLE IF NOT EXISTS team_tags (
	id SERIAL PRIMARY KEY,
	team_id INT REFERENCES teams(id) ON DELETE CASCADE,
	tag TEXT NOT NULL
);