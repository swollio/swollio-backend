import User from "./user"

export default interface Team {
    id?: number
    pin: number
    name: string
    sport: string
    coach: User
}
