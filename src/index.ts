import mongoose from 'mongoose';

import { app } from './app';
import moment from 'moment-timezone';

const start = async () => {
    try {
        [
            'JWT_SECRET',
            'ENVIRONMENT',
        ].forEach((envVar) => {
            if (!process.env[envVar]) {
                throw new Error(`${envVar} not defined.`);
            }
        });

        if (process.env.ENVIRONMENT! === 'prod') {
            await mongoose.connect(`${process.env.MONGO_URI_PROD!}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            });
        } else {
            await mongoose.connect(process.env.MONGO_URI_DEV!, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            });
        }
        console.log('Connected to MongoDB');

        moment.tz.setDefault('Asia/Kolkata');

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Listening on port ${port}!!`);
        });
    } catch (err) {
        console.error(err);
    }
};

start();
