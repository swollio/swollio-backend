-- Creates our workout results table --
CREATE TABLE IF NOT EXISTS workout_results (
	id SERIAL PRIMARY KEY,
    athlete_id INT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    assignment_id INT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    workout_id INT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    weight INT NOT NULL,
    reps INT NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_DATE
    created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);