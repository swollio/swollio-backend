export default interface Athlete {
    id: number,
    name: string,
	gender: "male" | "female",
	age: number,
	weight: number,
	height: number,	
	coaches: { id: number, name: string } [],
	equipment: { id: number, name: string } [],
	tags: { coach_id: number, tags: string [] } [],
	progress: {
		coach_id: number,
        workout_id: number, 
        exercise_id: number,
        date: string,
        weight: number[], 
        reps_completed: number[],
        reps_assigned: number[]
    } []
}