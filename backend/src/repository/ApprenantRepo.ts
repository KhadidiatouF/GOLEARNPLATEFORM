
import {  PrismaClient, Apprenant } from "@prisma/client";
import { IRepository } from "./IRepository";



export class ApprenantRepo implements IRepository <Apprenant>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(): Promise<Apprenant[]> {
        return await this.prisma.apprenant.findMany({
            include: {
                utilisateur: true
            }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.apprenant.findUnique({
            where: {id},
            include: {
                utilisateur: true,
                formations: {
                    include: {
                        formation: true
                    }
                },
                certifications: true,
                paiements: true
            }
        });
    }

    async create(data: Omit<Apprenant, "id">): Promise<Apprenant> {
        return await this.prisma.apprenant.create({data});
    }

    async update(id: number, data: Apprenant): Promise<Apprenant> {
        return await this.prisma.apprenant.update({where: {id}, data});
    }

    async delete(id: number): Promise<void> {
        await this.prisma.apprenant.delete({where:{id}})
    }

}
