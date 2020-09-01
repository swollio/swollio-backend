import WorkoutDetails from "./workoutDetails"

export default interface WorkoutInstance {
    id: number
    date: string
    details: WorkoutDetails[]
}
