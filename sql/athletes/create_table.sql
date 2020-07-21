CREATE TABLE athletes (
	id SERIAL PRIMARY KEY,
   	first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender TEXT,
    height INT,
   	weight INT,
    age INT
);
