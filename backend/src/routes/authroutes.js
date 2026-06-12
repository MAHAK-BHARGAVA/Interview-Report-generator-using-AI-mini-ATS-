import { Router } from "express";
import * as authController from "../controllers/authcontroller.js";
import authMiddleware from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);
authRouter.get('/getme', authMiddleware, authController.getme);

export default authRouter;