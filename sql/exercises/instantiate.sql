CREATE TABLE IF NOT EXISTS exercises (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL,
   	weight INT,
    reps INT,
   	legitimacy INT
);

CREATE TABLE IF NOT EXISTS muscles (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exercises_muscles (
	exercise_id INT,
	muscle_id INT,	
	PRIMARY KEY (exercise_id, muscle_id)
);

CREATE TABLE IF NOT EXISTS exercises_equipment (
	exercise_id INT,
	equipment_id INT,	
	PRIMARY KEY (exercise_id, equipment_id)
);
