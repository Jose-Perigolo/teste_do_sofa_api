import express from 'express';
import controller from '../controllers/user.controller';
import extractJWT from '../middleware/extractJWT';

const userRouter = express.Router();

userRouter.get('/validate', extractJWT, controller.validateToken);
userRouter.post('/register', controller.register);
userRouter.delete('/:_id', controller.deleteUser);
userRouter.put('/update', controller.update);
userRouter.post('/login', controller.login);
userRouter.get('/get/all', controller.getAllUsers);

export = userRouter;