import { UserDoc } from "./models/user.model";
import {Request, Response, NextFunction} from 'express';

export enum Roles {
    User = "user",
    Admin = "admin"
}

export interface JWTUser {
    id: UserDoc['id'],
    role: Roles,
}

export interface UserRequest extends Request {
    user?: JWTUser;
}

export class Errors {
    static userErr = (res: Response, err: string = "User Error", statusCode: number = 400) => {
        res.status(statusCode).json({
            err
        })
    }
    static serverErr = (res: Response, err: string = "Internal Server Error", statusCode: number = 500) => {
        console.log(err);
        res.status(statusCode).json({
            err
        })
    }
}