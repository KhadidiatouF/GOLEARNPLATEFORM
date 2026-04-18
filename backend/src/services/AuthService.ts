import { AuthRepository, Connexion } from "../repository/AuthRepo"
import { PasswordResetService } from "./PasswordResetService";


export class AuthService{

    static async login(connexion: Connexion){
        return await AuthRepository.auth(connexion)
    }

    static async refreshToken(refreshToken : string){
        return await AuthRepository.refreshToken(refreshToken)

    }

    static async resetPassword(token: string, newPassword: string) {
        return await PasswordResetService.resetPassword(token, newPassword);
    }
    
}
