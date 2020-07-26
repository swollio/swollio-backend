import Assignment from './assignment'

export default interface Workout {
    id?: number,
    created?: string,
    name: string,
    repeat: "none" | "weekly";
    tags: string [],
    assignments: Assignment []
}
