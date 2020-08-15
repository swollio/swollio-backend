-- Gets the team_tag_id of a team_tag given the team id and tag --
SELECT id FROM team_tags
WHERE team_id = %1$L AND 
      tag = %2$L;