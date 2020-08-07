CREATE TABLE IF NOT EXISTS workout_surveys (
    athlete_id REFERENCES athletes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    workout_id REFERENCES workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    due_date TIMESTAMPTZ NOT NULL,
    rating NUMERIC -- 1-5,
    hours_sleep INT, -- Sleep for the day
    wellness INT -- General wellness after workout on a scale of 1-5
);