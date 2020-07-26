import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.json';

interface Token {
    permissions?: string[],
}

export function requirePermission(permissions: string[]): express.Handler {
    return (req, res, next) => {
        const auth_token = req.header('Authorization')?.split(' ')[1];
        if (auth_token) {
            jwt.verify(auth_token, config.auth.secret, (err, decoded) => {
                if (!err && typeof decoded !== 'undefined') {
                    const token: Token = (decoded as Token);
                    const token_permissions = token.permissions ? token.permissions: [];
                    if (permissions.every(val => token_permissions.includes(val))) {
                        req.token = token;
                        next()
                    } else {
                        res.status(403).send('invalid permissions');
                    }
                } else {
                    res.status(403).send('invalid bearer token');
                }
            });
        } else {
            res.status(403).send('invalid bearer token')
        }
    }
}