export const ATHLETE_D_TYPES = {
    number: ["height", "weight", "age"],
    string: ["firstName", "lastName", "gender"] 
};

// What else do we want to store about muscles?
interface Muscle {
    name : string
}

export const PRIMARY_MUSCLES : Array<Muscle> = [
    { name: "Quadriceps" },
    { name: "Hamstrings" },
    { name: "Calves" },
    { name: "Chest" },
    { name: "Back" },
    { name: "Shoulders" },
    { name: "Triceps" },
    { name: "Biceps" },
    { name: "Forearms" },
    { name: "Trapezius" },
    { name: "Abs" }
]