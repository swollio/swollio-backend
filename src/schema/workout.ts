import Assignment from "./assignment"

export default interface Workout {
    id?: number
    created?: string
    dates: string[]
    name: string
    tags: string[]
    assignments: Assignment[]
}
