export default interface Assignment {
	id?: number,
	team_id?: number,
	exercise_id: number,
	workout_id: number,
	rep_count: number[],
	weight_scheme: "constant" | "increasing"
}