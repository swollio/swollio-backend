import express from "express"
import jwt from "jsonwebtoken"
import config from "../config.json"
import { pool } from "../utilities/database"
import UserModel from "../models/user"

interface Token {
    user_id: number
    permissions?: string[]
}

export default function requirePermission(
    permissions: string[]
): express.Handler {
    return async (req, res, next) => {
        /*
         * Parse the authentication token from the Authorization header of
         * their request. The only currently supported authentication scheme
         * is Bearer token.
         *
         * For more information about the Bearer token scheme, visit:
         * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
         */
        const authToken = req.header("Authorization")?.split(" ")[1]

        /*
         * If the user does not provide a Bearer token, instantly return a 401
         * error.
         */
        if (!authToken) {
            res.status(401).send({
                error: {
                    status: 401,
                    message: "No token provided",
                },
            })
            return
        }

        try {
            const decoded = await jwt.verify(authToken, config.auth.secret)
            const token: Token = decoded as Token
            const tokenPermissions = token.permissions || []

            /*
             * The permission system is currently limited to a list of actions that
             * a user is allowed to take. Currently, this is not implemented and any
             * user has any access to any endpoint! This is very dangerous. At the
             * very least, we should add an 'admin' role.
             *
             * TODO: Add required roles for dangerous endpoints
             */
            const hasNecessaryPermissions = permissions.every((val) =>
                tokenPermissions.includes(val)
            )

            if (!hasNecessaryPermissions) {
                res.status(403).send({
                    error: {
                        status: 403,
                        message: "Invalid permissions",
                    },
                })
                return
            }

            /*
             * Check the database to make sure that the user still exists to prevent
             * tokens issued from non-existant users from doing anything. This cam later
             * be extended to optionally disable any account with a flag in the database.
             *
             * TODO: add flag to user account schema to temporarily block a user from
             * performing any action.
             */
            const client = await pool.connect()
            try {
                const Users = new UserModel(client)
                const user = await Users.readOne(token.user_id)
                if (user) {
                    req.token = token
                    next()
                } else {
                    res.status(401).send({
                        error: {
                            status: 401,
                            message: "User does not exist",
                        },
                    })
                }
            } finally {
                client.release()
            }
        } catch (error) {
            /*
             * If the token is invalid, or an error occurs during decoding,
             * return a 401 error. An example of when this might occur is
             * if the token secret gets rotated. All tokens signed with the
             * old secret will be invalidated.
             */
            res.status(401).send({
                error: {
                    status: 401,
                    message: "Invalid token provided",
                },
            })
        }
    }
}
