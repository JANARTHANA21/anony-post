import e from "express";
import {register,login} from '../controllers/authController.js';

const authRouter =e.Router();

authRouter.route('/register').post(register)
authRouter.route('/login').post(login)

export default authRouter;