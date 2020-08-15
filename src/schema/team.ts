import Workout from './workout'

export default interface Team {
	id: number,
	name: string
	sport: string,
	coach: string,
	athletes: { id: number, name: string, tags: string[]} []
	workouts: Workout [],
}
