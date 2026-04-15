
import {  PrismaClient, Utilisateur } from "@prisma/client";
import { IRepository } from "./IRepository";



export class UtilisateurRepo implements IRepository <Utilisateur>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(page: number = 1, limit: number = 10, role?: string, search?: string): Promise<{data: Utilisateur[], total: number, page: number, limit: number}> {
        const skip = (page - 1) * limit;
        
        const whereClause: any = {};
        
        // Filtre par rôle
        if (role) {
            whereClause.role = role;
        }

        // Filtre par recherche sur nom, prénom ou email (sensible à la casse pour compatibilité)
        if (search && search.trim()) {
            const searchTerm = search.trim();
            whereClause.OR = [
                { nom: { contains: searchTerm } },
                { prenom: { contains: searchTerm } },
                { email: { contains: searchTerm } }
            ];
        }

        const [users, total] = await Promise.all([
            this.prisma.utilisateur.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    apprenant: true,
                    professeur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.utilisateur.count({ where: whereClause })
        ]);
        return { data: users, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.utilisateur.findUnique({where: {id}});
    }

    async findByLogin(login: string): Promise<any> {
        return await this.prisma.utilisateur.findUnique({where: {login}});
    }

    async create(data: any): Promise<Utilisateur> {
        // Filtrer les champs undefined pour éviter les erreurs Prisma
        const cleanedData: any = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanedData[key] = value;
            }
        }
        return await this.prisma.utilisateur.create({data: cleanedData});
    }

    async update(id: number, data: any): Promise<Utilisateur> {
        // Filtrer les champs undefined pour éviter les erreurs Prisma
        const cleanedData: any = {};
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                cleanedData[key] = value;
            }
        }
        return await this.prisma.utilisateur.update({where: {id}, data: cleanedData});
    }

    async delete(id: number): Promise<void> {
        await this.prisma.utilisateur.delete({where:{id}})
    }

}