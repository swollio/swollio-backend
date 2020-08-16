import db from "../../utilities/database"
import Survey from "../../schema/survey"

/**
 * This workflow adds a an athlete's survey to thex
 * @param athleteId The id of the athlete filling out the survey
 * @param workoutId The id of the workout to which this survey refers
 * @param survey The survey object that contains the survey data
 */
export default async function addSurvey(
    athleteId: number,
    workoutId: number,
    survey: Survey
): Promise<void> {
    // Making sure we have valid survey data
    if (!survey) throw new Error("No survey received!")

    try {
        await db["surveys.add_one"]([
            athleteId,
            workoutId,
            survey.due_date,
            survey.rating,
            survey.hours_sleep,
            survey.wellness,
        ])
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}
