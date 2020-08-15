CREATE TABLE IF NOT EXISTS athletes_teams (
    athlete_id INT NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id)  ON DELETE CASCADE,
    
    PRIMARY KEY (athlete_id, team_id)
);