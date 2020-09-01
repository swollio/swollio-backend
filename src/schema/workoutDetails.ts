import Assignment from "./assignment"

export default interface WorkoutDetails {
    team_name: string
    name: string
    completed: boolean
    assignments: Assignment[]
}
