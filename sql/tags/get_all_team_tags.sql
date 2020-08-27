-- Returns an array of all the tags a team with a given id has --
SELECT id, tag FROM team_tags
WHERE team_id = %1$L;