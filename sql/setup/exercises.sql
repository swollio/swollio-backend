CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    weight INT NOT NULL,
    reps INT NOT NULL,
    legitimacy INT NOT NULL
);