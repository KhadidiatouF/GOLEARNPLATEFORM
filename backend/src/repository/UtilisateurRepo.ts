
import {  PrismaClient, Utilisateur } from "@prisma/client";
import { IRepository } from "./IRepository";



export class UtilisateurRepo implements IRepository <Utilisateur>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(): Promise<Utilisateur[]> {
        return await this.prisma.utilisateur.findMany({});
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.utilisateur.findUnique({where: {id}});
    }

    async create(data: Omit<Utilisateur, "id">): Promise<Utilisateur> {
        return await this.prisma.utilisateur.create({data});
    }

    async update(id: number, data: Utilisateur): Promise<Utilisateur> {
        return await this.prisma.utilisateur.update({where: {id}, data});
    }

    async delete(id: number): Promise<void> {
        await this.prisma.utilisateur.delete({where:{id}})
    }

}