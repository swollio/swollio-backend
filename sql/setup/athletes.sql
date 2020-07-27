CREATE TABLE IF NOT EXISTS athletes (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age INT,
    height INT,
    weight INT,
    gender TEXT
);