import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { HttpCode } from "../enums/codeError";
import { ErrorCode } from "../middlewares/messageError";
import { ZodError } from "zod";
import { resetPasswordSchema } from "../validators/AuthValidator";


export class AuthController{

    static async login(req:Request, res:Response){
        try {
            const connexion = req.body;
            const tokens = await AuthService.login(connexion);

            if (!tokens) {
                return res.status(HttpCode.NOT_FOUND).json({error: ErrorCode.TOKEN_NOT_FOUND})
            }
            
            res.status(HttpCode.OK).json({tokens}) 
        }catch (error: any) {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).json({error: error.message})
        }

    }

    static async refreshToken(req:Request, res:Response){
        try {
            const refreshToken = req.body;
            const token = await AuthService.refreshToken(refreshToken)

            if (!token) {
                return res.status(HttpCode.NOT_FOUND).json({error: ErrorCode.TOKEN_NOT_FOUND})
            }

            res.status(HttpCode.OK).json({token})
            
        }catch (error: any) {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).json({error: error.message})
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = resetPasswordSchema.parse(req.body);
            await AuthService.resetPassword(token, newPassword);

            return res.status(HttpCode.OK).json({
                success: true,
                message: "Mot de passe modifie avec succes."
            });
        } catch (error: any) {
            if (error instanceof ZodError) {
                return res.status(HttpCode.BAD_REQUEST).json({
                    success: false,
                    message: error.issues[0]?.message || "Erreur de validation"
                });
            }

            return res.status(HttpCode.BAD_REQUEST).json({
                success: false,
                message: error.message || "Impossible de modifier le mot de passe."
            });
        }
    }

}
