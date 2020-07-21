CREATE TABLE exercises (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL,
   	weight INT,
    reps INT,
   	legitimacy INT,

);

CREATE TABLE muscles (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL,
);

CREATE TABLE equipment (
	id  SERIAL PRIMARY KEY,
   	name TEXT NOT NULL,
);

CREATE TABLE exercises_muscles (
	exercise_id INT,
	muscle_id INT,	
	PRIMARY KEY (exercise_id, muscle_id)
);

CREATE TABLE exercises_equipment (
	exercise_id INT,
	equipment_id INT,	
	PRIMARY KEY (exercise_id, equipment_id)
);

SELECT (id, name)
FROM exercises
INNER JOIN exercises_muscles
ON exercises.id = exercises_muscles.exercise_id
WHERE exercises_muscles.muscle_id = $1
