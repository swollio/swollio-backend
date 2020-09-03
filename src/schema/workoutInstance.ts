import Assignment from "./assignment"

export default interface WorkoutInstance {
    id: number
    team_name: string
    name: string
    completed: boolean
    assignments: Assignment[]
}
