/**
 * This file contains the database model for exercises.
 * All database specific types and data are fully encapsulated.
 */

import { pool } from "../utilities/database"
import User from "../schema/user"
import CurrentUser from "../schema/currentUser"

/**
 * Create a user in the users table with the given information and return a
 * promise resolving to the new user instance with its generated ID
 *
 * @param user The data that needs to be inserted for the user
 * @returns {Promise<User>} A promise resolving to the user object that is stored in the database
 */
export async function createOne(user: User): Promise<User> {
    try {
        const values = `('${user.first_name}', '${user.last_name}', '${user.email}', '${user.hash}')`
        const userResult = await pool.query(`
            INSERT INTO users
            (first_name, last_name, email, hash)
            VALUES ${values}
            RETURNING id;
        `)

        return { id: userResult.rows[0].id, ...user }
    } catch (error) {
        throw new Error(`models:user:createOne ${error.message}`)
    }
}

/**
 * Gets the id, first name, last name, and email of all users in
 * the user database and returns them as a User[]
 *
 * @returns {Promise<User[]>} The array of all the users in the database
 */
export async function readAll(): Promise<User[]> {
    try {
        const users = await pool.query(`
            SELECT id, first_name, last_name, email
            FROM users;
        `)

        return users.rows
    } catch (error) {
        throw new Error(`models:user:readAll ${error.message}`)
    }
}

/**
 * Gets the id, first_name, last_name, email, and hash of the user with the
 * given id and returns them all as a User object
 *
 * @param id The id of the user to get
 */
export async function readOne(userId: number): Promise<User | null> {
    try {
        const users = await pool.query(`
            SELECT id, first_name, last_name, email, hash
            FROM users
            WHERE id = ${userId};
        `)

        // If there are no users with that id, then we want to return null
        // to indicate so
        if (users.rowCount === 0) return null

        return users.rows[0]
    } catch (error) {
        throw new Error(`models:user:readOne ${error.message}`)
    }
}

/**
 * Updates a user with the given id in the database with the data that is passed in to the function.
 * Allows for partial updates, so only the fields that are passed in will be updated.
 *
 * @param user The new user type with the data that needs to be updated. Must have an id
 */
export async function update(user: {
    user_id: number
    first_name?: string
    last_name?: string
    email?: string
    hash?: string
}): Promise<void> {
    try {
        // If the key is defined, then return 'value', else return null
        const firstNameUpdate = user.first_name ? `'${user.first_name}'` : null
        const lastNameUpdate = user.last_name ? `'${user.last_name}'` : null
        const emailUpdate = user.email ? `'${user.email}'` : null
        const hashUpdate = user.hash ? `'${user.hash}'` : null

        await pool.query(`
            UPDATE users
            SET
                first_name = COALESCE(${firstNameUpdate}, first_name),
                last_name = COALESCE(${lastNameUpdate}, last_name),
                email = COALESCE(${emailUpdate}, email),
                hash = COALESCE(${hashUpdate}, hash)
            WHERE id = ${user.user_id}
        `)
    } catch (error) {
        throw new Error(`models:user:update:: ${error.message}`)
    }
}

/**
 * Deletes the user with the given id from the users table and returns said user. If no user is
 * found in the database with the given id, then null is returned
 *
 * @param id The id of the user to delete
 * @returns {Promise<User | null>} The user that is deleted or null if the user does not exist
 */
export async function destroy(userId: number): Promise<User | null> {
    try {
        const user = await pool.query(`
            DELETE FROM users
            WHERE id=${userId}
            RETURNING id, first_name, last_name, email, hash;
        `)

        // Validating that the query returned something
        if (user.rowCount === 0) return null

        return user.rows[0]
    } catch (error) {
        throw new Error(`models:user:delete:: ${error.message}`)
    }
}

/**
 * Gets the current user's relevant data, such as the athlete or team id, team pin, and user
 * data. If no such user is found, returns null
 *
 * @param id The id of the user to get the details of
 * @returns {Promise<CurrentUser | null>} The current user's data or null if no such user exists
 */
export async function current(userId: number): Promise<CurrentUser | null> {
    try {
        const currentUser = await pool.query(`
            SELECT 
                users.id as user_id, 
                first_name, 
                last_name, 
                email, 
                teams.id AS team_id, 
                athletes.id AS athlete_id, 
                teams.pin AS pin 
            FROM users 
            LEFT JOIN teams
                ON coach_id = users.id
            LEFT JOIN athletes
                ON user_id = users.id
            WHERE users.id = ${userId};
        `)

        if (currentUser.rowCount === 0) return null

        return currentUser.rows[0]
    } catch (error) {
        throw new Error(`models:user:current:: ${error.message}`)
    }
}
