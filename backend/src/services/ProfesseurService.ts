import {ProfesseurRepo} from "../repository/ProfesseurRepo";


export class ProfesseurService{
    private professeurRepo: ProfesseurRepo;

    constructor(){
        this.professeurRepo = new ProfesseurRepo();
    }

    getAllProfesseurs(){
        return this.professeurRepo.findAll();
    }

    getOneProfesseur(id: number){
        return this.professeurRepo.findById(id);
    }
    
    createProfesseur(data: any){
        return this.professeurRepo.create(data)
    }

    updateProfesseur(id: number, data: any){
        return this.professeurRepo.update(id, data)
    }

    deleteProfesseur(id: number){
        return this.professeurRepo.delete(id)
    }
}
