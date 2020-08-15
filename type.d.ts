declare namespace Express {
    export interface Request {
        token: any;
    }
    export interface Response {
        token: {permissions: string[]};
    }
 }