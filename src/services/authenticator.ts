import {Request, Response, NextFunction} from 'express';
import { JWTUser, UserRequest } from '../common';
const jwt = require('jsonwebtoken');

export const authenticateJWT = (req: UserRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err: Error, user: JWTUser) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};