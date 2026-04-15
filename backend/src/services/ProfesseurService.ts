import {ProfesseurRepo} from "../repository/ProfesseurRepo";
import { PrismaClient } from "@prisma/client";

export class ProfesseurService{
    private professeurRepo: ProfesseurRepo;
    private prisma: PrismaClient;

    constructor(){
        this.professeurRepo = new ProfesseurRepo();
        this.prisma = new PrismaClient();
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

    // Valider un professeur
    async validerProfesseur(id: number) {
        return await this.professeurRepo.updateStatut(id, 'VALIDE');
    }

    // Rejeter un professeur
    async rejeterProfesseur(id: number) {
        return await this.professeurRepo.updateStatut(id, 'REJETE');
    }

    // Récupérer les demandes en attente
    getDemandesEnAttente(){
        return this.professeurRepo.findByStatut('EN_ATTENTE');
    }

    // Récupérer l'historique des revenus du professeur
    async getHistoriqueRevenus(professeurId: number) {
        // Récupérer toutes les formations du professeur
        const formations = await this.prisma.formation.findMany({
            where: { professeurId }
        });

        const historiqueRevenus = [];

        // Pour chaque formation, récupérer les apprenants inscrits
        for (const formation of formations) {
            const inscriptions = await this.prisma.apprenantFormation.findMany({
                where: { formationId: formation.id },
                include: { 
                    apprenant: { 
                        include: { utilisateur: true } 
                    }
                },
                orderBy: { id: 'desc' }
            });

            // Ajouter chaque inscription dans l'historique
            for (const inscription of inscriptions) {
                historiqueRevenus.push({
                    id: inscription.id,
                    date: new Date(),
                    formationTitre: formation.titre,
                    formationId: formation.id,
                    montantTotal: formation.prix,
                    partProfesseur: formation.prix * 0.70,
                    apprenantNom: `${inscription.apprenant.utilisateur.prenom} ${inscription.apprenant.utilisateur.nom}`,
                    apprenantEmail: inscription.apprenant.utilisateur.email
                });
            }
        }

        // Trier par date décroissante
        return historiqueRevenus.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}
