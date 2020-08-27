import Assignment from "./assignment"

export default interface Workout {
    id?: number
    name: string
    dates: string[]
    assignments: Assignment[]
}
