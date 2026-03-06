import { PrismaClient,Professeur } from "@prisma/client";
import { IRepository } from "./IRepository";



export class ProfesseurRepo implements IRepository <Professeur>{
    private prisma : PrismaClient = new PrismaClient();
    
    async findAll(): Promise<Professeur[]> {
        return await this.prisma.professeur.findMany({
            include: {
                utilisateur: true
            }
        });
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.professeur.findUnique({
            where: {id},
            include: {
                utilisateur: true,
                formations: true
            }
        });
    }

    async create(data: Omit<Professeur, "id">): Promise<Professeur> {
        return await this.prisma.professeur.create({data});
    }

    async update(id: number, data:Professeur): Promise<Professeur> {
        return await this.prisma.professeur.update({where: {id}, data});
    }

    async delete(id: number): Promise<void> {
        await this.prisma.professeur.delete({where:{id}})
    }

}
