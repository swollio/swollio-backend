SELECT exercises.* FROM exercises
INNER JOIN equipment_exercises
	ON equipment_exercises.exercise_id = exercises.id
INNER JOIN equipment
	ON equipment_exercises.equipment_id = equipment.id
WHERE equipment.name = $1;