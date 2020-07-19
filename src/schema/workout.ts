import Assignment from './assignment'

export default interface Workout {
    id: number,
    name: string,
    date: string,
    primary_muscles: string [],
    secondary_muscles: string [], 
    estimated_time: number,
    tags: string [],
    repeat: "none" | "weekly";
    exercises: Assignment []
}
