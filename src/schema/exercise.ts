export default interface Exercise {
	id: number,
	name: string,
	primary_muscles: [],
	secondary_muscles: [],
	equipment: string [],
	weight: "light" | "medium" | "heavy",
	legitimacy: number,
}
