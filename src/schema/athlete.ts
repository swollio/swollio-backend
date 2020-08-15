export default interface Athlete {
    id?: number,
    user_id: number,
    name: string,
    age: number,
    height: number,	
    weight: number,
    gender: "male" | "female",
    pin?: number
}