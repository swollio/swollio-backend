SELECT exercises.* FROM exercises 
WHERE exercises.name 
LIKE '%' || $1 || '%';