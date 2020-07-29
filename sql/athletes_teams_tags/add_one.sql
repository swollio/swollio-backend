-- Inserts a row into the athletes_teams_tags table, thereby 
-- adding a tag to an athlete on a team
INSERT INTO athletes_teams_tags(athlete_id, team_id, tag_id)
VALUES (%1$L, %2$L, %3$L);