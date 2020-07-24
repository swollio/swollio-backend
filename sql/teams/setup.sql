CREATE TABLE IF NOT EXISTS teams(
	id SERIAL PRIMARY KEY,
	coach_id INT,
	name TEXT,
	sport TEXT,
	
	CONSTRAINT team_coach
		FOREIGN KEY(coach_ID)
			REFERENCES users(id)
			ON DELETE NO ACTION --This needs to be changed. Perhaps CASCADE?--
);
