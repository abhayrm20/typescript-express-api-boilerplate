import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { json } from 'body-parser';
require('dotenv').config()
const morgan = require('morgan');

import pjson from '../package.json';
import { userRouter } from './routes/user.route';

const app = express();
app.set('trust proxy', true);
app.use(json() as RequestHandler);
app.use(morgan('tiny'));

app.all('/', (req: Request, res: Response) => {
    res.json({
        name: pjson.name,
        version: pjson.version
    });
});

app.use('/user', userRouter);

app.all('*', async (req: Request, res: Response) => {
    res.status(404).json("Not found")
});


export { app };
