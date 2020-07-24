CREATE TABLE IF NOT EXISTS workouts(
    id SERIAL PRIMARY KEY,
    team_id INT,
    name TEXT,
    date DATE,
    tag_id INT,
    estimated_time INT,
    repeat INT,

    CONSTRAINT workout_team
        FOREIGN KEY(team_id)
            REFERENCES teams(id)
            ON DELETE NO ACTION,
    
    CONSTRAINT workout_tag
    	FOREIGN KEY(tag_id)
    		REFERENCES tags(id)
    		ON DELETE NO ACTION
    		
    CONSTRAINT workout_repeat
    	FOREIGN KEY(repeat)
    		REFERENCES repeats(id)
    		ON DELETE NO ACTION
);