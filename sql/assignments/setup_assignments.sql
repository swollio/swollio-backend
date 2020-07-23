CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    workout_id INT,
    team_id INT,
    exercise_id INT,
    rep_count INT,
    weight_model INT,
    
    CONSTRAINT assignment_weight_range
        FOREIGN KEY(weight_model)
            REFERENCES weight_model(id)
            ON DELETE NO ACTION, -- Not sure what to do if a weight model is deleted --
    
    CONSTRAINT assignment_workout
        FOREIGN KEY(workout_id)
            REFERENCES workouts(id)
            ON DELETE NO ACTION, -- Not sure what to do here
    
    CONSTRAINT assignment_team
        FOREIGN KEY(team_id)
            REFERENCES teams(id)
            ON DELETE NO ACTION, -- Not sure what to do here
    
    CONSTRAINT assignment_exercise
        FOREIGN KEY(exercise_id)
            REFERENCES exercises(id)
            ON DELETE NO ACTION, -- Not sure what to do here
);