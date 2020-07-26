CREATE TABLE IF NOT EXISTS athletes_teams_tag (
    athlete_id INT NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
    tag TEXT,
    
    PRIMARY KEY (athlete_id, team_id, tag)
);