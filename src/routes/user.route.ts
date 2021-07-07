import { Router, Request, Response } from 'express';
import { Errors, Roles, UserRequest } from '../common';
import userController from '../controllers/user.controller';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { body, param, validationResult } from 'express-validator';
import { authenticateJWT } from '../services/authenticator';

const router = Router();

router.post('/login', async (req: UserRequest, res: Response) => {
    try {
        const { phone, email, password } = req.body;
        let user;
        if (phone) user = await userController.Read.byPhone(phone);
        else if (email) user = await userController.Read.byEmail(email);
        else Errors.userErr(res, 'Invalid login credentials.', 401);

        if (!password || !user) Errors.userErr(res, 'Invalid login credentials.', 401);

        const hashedPassword = user?.password;

        if(await bcrypt.compare(password, hashedPassword)) {
            const token = await jwt.sign({
                id: user?.id,
                role: Roles.User
            }, process.env.JWT_SECRET);

            res.json({ token });
        } else {
            Errors.userErr(res, 'Invalid login credentials.', 401)
        }
    } catch (e) {
        Errors.serverErr(res, e);
    }
});

router.post('/register',
    body('name').exists().isAlphanumeric(),
    body('phone').exists().isNumeric(),
    body('email').exists().isAlphanumeric(),
    body('password').exists().isAlphanumeric(),
    async (req: UserRequest, res: Response) => {
        try {
            const { name, phone, email, password } = req.body;
            console.log(req.body);

            const userCount = await userController.Read.userCount(phone, email);

            if (userCount > 0) return Errors.userErr(res, 'User already registered.');

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await userController.Create.newUser({
                name, phone, email,
                password: hashedPassword
            });

            console.log(hashedPassword);

            console.log(user);

            const token = await jwt.sign({
                id: user.id,
                role: Roles.User
            }, process.env.JWT_SECRET);

            res.json({ token });

        } catch (e) {
            Errors.serverErr(res, e);
        }
    });

router.get('/', authenticateJWT, async (req: UserRequest, res: Response) => {
    try {
        const { id, role } = req.user!;

        console.log(id);
        console.log(role);

        const user = await userController.Read.byId(id);
        res.json(user);
    } catch (e) {
        Errors.serverErr(res, e);
    }
})

export { router as userRouter };


