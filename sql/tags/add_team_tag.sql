-- Inserts a tag into the tags table --
INSERT INTO teams_tags(team_id, tag)
VALUES (%1$L, %2$L)
RETURNING id;