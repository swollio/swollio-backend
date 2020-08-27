import Muscle from "./muscle"

export default interface Exercise {
    id?: number
    name: string
    muscles: Muscle[]
}
