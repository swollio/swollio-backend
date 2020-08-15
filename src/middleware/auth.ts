import express from "express"
import jwt from "jsonwebtoken"
import config from "../config.json"

interface Token {
    user_id: number
    permissions?: string[]
}

export default function requirePermission(
    permissions: string[]
): express.Handler {
    return (req, res, next) => {
        const authToken = req.header("Authorization")?.split(" ")[1]
        if (authToken) {
            jwt.verify(authToken, config.auth.secret, (err, decoded) => {
                if (!err && typeof decoded !== "undefined") {
                    const token: Token = decoded as Token
                    const tokenPermissions = token.permissions
                        ? token.permissions
                        : []
                    if (
                        permissions.every((val) =>
                            tokenPermissions.includes(val)
                        )
                    ) {
                        req.token = token
                        next()
                    } else {
                        res.status(403).send("invalid permissions")
                    }
                } else {
                    res.status(403).send("invalid bearer token")
                }
            })
        } else {
            res.status(403).send("invalid bearer token")
        }
    }
}
