export default interface Assignment {
	id: number,
	name: string,
	equipment: string [],
	reps: number[],
	weight: "constant" | "increasing"
}
