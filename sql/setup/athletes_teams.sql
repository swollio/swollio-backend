CREATE TABLE athlete_team_tags(
	athlete_id INT REFERENCES athletes(id) ON DELETE CASCADE,
	team_tag_id INT REFERENCES team_tags(id) ON DELETE CASCADE,
	
	PRIMARY KEY (athlete_id, team_tag_id)
);  