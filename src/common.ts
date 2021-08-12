import { UserDoc } from "./models/user.model";
import {Request, Response, NextFunction} from 'express';
import { ValidationError, validationResult } from 'express-validator';

export enum Roles {
    User = "user",
    Admin = "admin",
    Manager = "manager",
    Telecaller = "telecaller",
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

export const validateRequest = (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        throw new RequestValidationError(errors.array());
    next();
};

export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): {
        message: string;
        field?: string;
        code?: string;
        description?: string;
    }[];
}
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(({ msg, param }) => {
            return {
                message: msg,
                field: param,
            };
        });
    }
}
