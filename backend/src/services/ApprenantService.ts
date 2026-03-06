import { ApprenantRepo } from "../repository/ApprenantRepo";


export class ApprenantService{
    private apprenantRepo: ApprenantRepo;

    constructor(){
        this.apprenantRepo = new ApprenantRepo();
    }

    getAllApprenants(){
        return this.apprenantRepo.findAll();
    }

    getOneApprenant(id: number){
        return this.apprenantRepo.findById(id);
    }
    
    createApprenant(data: any){
        return this.apprenantRepo.create(data)
    }

    updateApprenant(id: number, data: any){
        return this.apprenantRepo.update(id, data)
    }

    deleteApprenant(id: number){
        return this.apprenantRepo.delete(id)
    }
}
