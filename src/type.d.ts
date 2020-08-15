/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Express {
    export interface Request {
        token: { [key: string]: any }
    }
    export interface Response {
        token: { permissions: string[] }
    }
}
