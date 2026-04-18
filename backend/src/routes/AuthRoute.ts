import { Router } from "express";
import { AuthController } from "../controllers/AuthController";


const route = Router();


route.post('/login', AuthController.login)
route.get('/refresh', AuthController.refreshToken)
route.post('/reset-password', AuthController.resetPassword)


export default route
