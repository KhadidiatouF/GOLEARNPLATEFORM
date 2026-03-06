import { UtilisateurRepo } from "../repository/UtilisateurRepo";
import bcrypt from "bcryptjs";


export class UtilisateurService{
    private utilisateurRepo: UtilisateurRepo;

    constructor(){
        this.utilisateurRepo = new UtilisateurRepo();
    }

    getAllUser(){
        return this.utilisateurRepo.findAll();
    }

    getOneUser(id: number){
        return this.utilisateurRepo.findById(id);
    }
    
    // createUser(data: any){
    //     return this.utilisateurRepo.create(data)
    // }

    async createUser(data: any) {
        if (data.mdp) {
        data.mdp = await bcrypt.hash(data.mdp, 10);
        }
        return this.utilisateurRepo.create(data);
    }


    updateUser(id: number, data: any){
        return this.utilisateurRepo.update(id, data)
    }

    deleteUser(id: number){
        return this.utilisateurRepo.delete(id)
    }
}