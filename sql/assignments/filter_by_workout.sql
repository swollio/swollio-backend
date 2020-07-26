SELECT assignments.id, exercises.name, assignments.weight_scheme, assignments.rep_count FROM assignments
INNER JOIN exercises
    ON exercises.id = assignments.exercise_id 
WHERE workout_id = %1$L;
