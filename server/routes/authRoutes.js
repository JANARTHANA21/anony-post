import e from "express";
import {register,login} from '../controllers/authController.js';
import refresh_token from "../controllers/refreshToken.js";

const authRouter =e.Router();

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)
authRouter.post('/refresh',refresh_token)
export default authRouter;