import Assignment from "./assignment"

export default interface Workout {
    id?: number
    created?: string
    start_date: string
    end_date?: string
    name: string
    repeat: string[]
    tags: string[]
    assignments: Assignment[]
}
