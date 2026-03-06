
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import {generateAccessToken, generateRefreshToken, JwtPayload, verifyRefreshToken} from "../auth/jwt";


const prisma = new PrismaClient();

export interface Connexion{
 
    login: string;
    mdp: string;
}


export interface AuthReponse {
    user: {
        id: number;
        nom: string;
        prenom: string;
        login: string;
        email: string;
        role: string;
       
    };
    accessToken: string;
    refreshToken: string;
  
}


export class AuthRepository{
 
    static async auth(connexion : Connexion): Promise<AuthReponse>{
        
        const {login, mdp} = connexion;

        const userTrouve = await prisma.utilisateur.findUnique({where: {login}});

        if (!userTrouve) {
            throw new Error("Login ou mot de passe incorrect");
        }

        const estPassword = await bcrypt.compare(mdp, userTrouve.mdp);
        if (!estPassword) {
            throw new Error("Login ou mot de passe incorrect");
        }

        const payload: JwtPayload ={
            login: userTrouve.login,
            mdp: userTrouve.mdp
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        const {mdp: _mdp, ...userwithoutpassword} = userTrouve;


        return {accessToken, refreshToken , user: userwithoutpassword}



    }

    static async refreshToken(refreshToken: string): Promise<{accessToken:string}> {
        const  payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new Error("Refresh token invalide");
        }
        const accessToken = generateAccessToken(payload)
        return { accessToken };
    }

}