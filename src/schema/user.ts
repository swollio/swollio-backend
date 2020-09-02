export default interface User {
    id?: number
    team_id?: number
    athlete_id?: number
    first_name: string
    last_name: string
    email: string
    hash?: string
}
