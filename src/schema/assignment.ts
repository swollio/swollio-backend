import Exercise from "./exercise"

export default interface Assignment {
    id?: number
    exercise: Exercise
    rep_count: number[]
}
