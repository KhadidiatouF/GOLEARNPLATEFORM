import { UtilisateurRepo } from "../repository/UtilisateurRepo";
import { PrismaClient, Role, StatutProfesseur } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class UtilisateurService{
    private utilisateurRepo: UtilisateurRepo;

    constructor(){
        this.utilisateurRepo = new UtilisateurRepo();
    }

    getAllUser(page: number = 1, limit: number = 5, role?: string, search?: string){
        return this.utilisateurRepo.findAll(page, limit, role, search);
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

        const { niveau, specialite, bio, role, ...userData } = data;

        try {
            const user = await this.utilisateurRepo.create({
            ...userData,
            role
            });

            if (role === 'APPRENANT') {
            await prisma.apprenant.create({
                data: {
                utilisateurId: user.id,
                niveau: niveau || null
                }
            });
            }

            if (role === 'PROF') {
            await prisma.professeur.create({
                data: {
                utilisateurId: user.id,
                specialite: specialite || null,
                bio: bio || null,
                statut: StatutProfesseur.VALIDE
                }
            });
            }

            return user;

        } catch (error) {
            console.error('Erreur dans createUser:', error);
            throw error;
        }
    }

    async updateUser(id: number, data: any) {

        const { niveau, specialite, bio, role, ...userData } = data;

        try {
            const user = await this.utilisateurRepo.update(id, {
            ...userData,
            role
            });

            if (role === 'APPRENANT') {
            await prisma.apprenant.upsert({
                where: { utilisateurId: id },
                update: {
                niveau: niveau || null
                },
                create: {
                utilisateurId: id,
                niveau: niveau || null
                }
            });
            }

            if (role === 'PROF') {
            await prisma.professeur.upsert({
                where: { utilisateurId: id },
                update: {
                specialite: specialite || null,
                bio: bio || null
                },
                create: {
                utilisateurId: id,
                specialite: specialite || null,
                bio: bio || null,
                statut: "VALIDE"
                }
            });
            }

            return user;

        } catch (error: any) {
            console.error("Erreur updateUser:", error);

            if (error.code === 'P2025') {
            return null;
            }

            throw error;
        }
    }
    
    deleteUser(id: number){
        prisma.apprenant.deleteMany({
            where: { utilisateurId: id }
        }).catch(() => {}); // Ignorer si n'existe pas
        
        prisma.professeur.deleteMany({
            where: { utilisateurId: id }
        }).catch(() => {}); // Ignorer si n'existe pas
        
        return this.utilisateurRepo.delete(id)
    }
}