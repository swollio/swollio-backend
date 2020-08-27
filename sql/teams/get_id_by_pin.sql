-- Gets team id using the given pin --
SELECT id FROM teams
WHERE pin = %1$L;