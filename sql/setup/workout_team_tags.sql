-- Creates a workout_tags join table --
CREATE TABLE IF NOT EXISTS workout_team_tags(
    workout_id INT NOT NULL,
    team_tag_id INT NOT NULL,

    FOREIGN KEY (workout_id)
    REFERENCES workouts(id),

    FOREIGN KEY (team_tag_id)
    REFERENCES team_tags(id)
);