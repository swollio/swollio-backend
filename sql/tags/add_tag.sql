-- Inserts a tag into the tags table --
INSERT INTO tags(tag)
VALUES (%1$L)
RETURNING id;