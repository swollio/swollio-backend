-- Inserts a row into the athlete_team_tags table, thereby 
-- adding a tag to an athlete on a team
INSERT INTO athlete_team_tags(athlete_id, team_tag_id)
VALUES (%1$L, %2$L);