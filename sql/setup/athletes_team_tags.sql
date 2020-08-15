-- This table keeps track of all the athletes' tags on their respective teams
CREATE TABLE IF NOT EXISTS athletes_teams_tags (
    athlete_id INT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    
    PRIMARY KEY (athlete_id, team_id, tag_id)
);