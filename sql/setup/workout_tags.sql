-- Creates a workout_tags join table --
CREATE TABLE IF NOT EXISTS workout_tags(
    workout_id INT NOT NULL,
    tag_id INT NOT NULL,

    FOREIGN KEY (workout_id)
    REFERENCES workouts(id)

    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
);