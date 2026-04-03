
import {  PrismaClient, Apprenant } from "@prisma/client";
import { IRepository } from "./IRepository";



export class ApprenantRepo implements IRepository <Apprenant>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(page: number = 1, limit: number = 10): Promise<{data:Apprenant[], total:number, page:number, limit:number}> {
        const skip = (page - 1) * limit;
        const [apprenants, total] = await Promise.all([
            this.prisma.apprenant.findMany({
                skip,
                take: limit,
                include: {
                    utilisateur: true
                },
                orderBy: { id: 'desc' }
            }),
            this.prisma.apprenant.count()
        ]);
        return { data: apprenants, total, page, limit };
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
