CREATE TABLE IF NOT EXISTS muscles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    nickname TEXT NOT NULL,
    region TEXT NOT NULL
);