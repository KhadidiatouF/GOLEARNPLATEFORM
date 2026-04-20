import { PrismaClient, Formation } from "@prisma/client";
import { IRepository } from "./IRepository";

export class FormationRepo implements IRepository<Formation> {
    private prisma: PrismaClient = new PrismaClient();

    async findAll(page: number = 1, limit: number = 10): Promise<{data: Formation[], total: number, page: number, limit: number}> {
        const skip = (page - 1) * limit;
        const [formations, total] = await Promise.all([
            this.prisma.formation.findMany({
                skip,
                take: limit,
                include: { 
                    professeur: { include: { utilisateur: true } },
                    sessions: true,
                    apprenants: true
                },
                orderBy: { dateCreation: 'desc' }
            }),
            this.prisma.formation.count()
        ]);
        return { data: formations, total, page, limit };
    }

    async findById(id: number): Promise<any> {
        return await this.prisma.formation.findUnique({
            where: { id },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: {
                    orderBy: { id: 'asc' },
                    include: { 
                        chapitres: { orderBy: { ordre: 'asc' } }, 
                        quiz: {
                            include: {
                                questions: {
                                    include: { reponses: true }
                                }
                            }
                        }
                    }
                },
                apprenants: true
            }
        });
    }

    async create(data: Omit<Formation, "id">): Promise<Formation> {
        return await this.prisma.formation.create({ data });
    }

    async update(id: number, data: Formation): Promise<Formation> {
        return await this.prisma.formation.update({ where: { id }, data });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            const formation = await tx.formation.findUnique({
                where: { id },
                select: {
                    id: true,
                    sessions: {
                        select: {
                            id: true,
                            quiz: {
                                select: {
                                    id: true,
                                    questions: {
                                        select: { id: true }
                                    }
                                }
                            }
                        }
                    },
                    quiz: {
                        select: {
                            id: true,
                            questions: {
                                select: { id: true }
                            }
                        }
                    },
                    apprenants: {
                        select: {
                            id: true,
                            progression: {
                                select: { id: true }
                            }
                        }
                    },
                    certifications: {
                        select: { id: true }
                    }
                }
            });

            if (!formation) {
                throw new Error("Formation non trouvée");
            }

            const sessionIds = formation.sessions.map((session) => session.id);
            const formationQuizIds = formation.quiz.map((quiz) => quiz.id);
            const sessionQuizIds = formation.sessions
                .map((session) => session.quiz?.id)
                .filter((quizId): quizId is number => typeof quizId === "number");
            const quizIds = [...new Set([...formationQuizIds, ...sessionQuizIds])];
            const questionIds = [
                ...formation.quiz.flatMap((quiz) => quiz.questions.map((question) => question.id)),
                ...formation.sessions.flatMap((session) => session.quiz?.questions.map((question) => question.id) || [])
            ];
            const apprenantFormationIds = formation.apprenants.map((apprenantFormation) => apprenantFormation.id);
            const progressionIds = formation.apprenants
                .map((apprenantFormation) => apprenantFormation.progression?.id)
                .filter((progressionId): progressionId is number => typeof progressionId === "number");
            const certificationIds = formation.certifications.map((certification) => certification.id);

            if (questionIds.length > 0) {
                await tx.reponse.deleteMany({
                    where: {
                        questionId: { in: questionIds }
                    }
                });
            }

            if (quizIds.length > 0) {
                await tx.question.deleteMany({
                    where: {
                        quizId: { in: quizIds }
                    }
                });

                await tx.quiz.deleteMany({
                    where: {
                        id: { in: quizIds }
                    }
                });
            }

            if (progressionIds.length > 0) {
                await tx.apprenantChapitre.deleteMany({
                    where: {
                        progressionId: { in: progressionIds }
                    }
                });

                await tx.progression.deleteMany({
                    where: {
                        id: { in: progressionIds }
                    }
                });
            }

            if (apprenantFormationIds.length > 0) {
                await tx.paiement.deleteMany({
                    where: {
                        apprenantFormationId: { in: apprenantFormationIds }
                    }
                });

                await tx.apprenantFormation.deleteMany({
                    where: {
                        id: { in: apprenantFormationIds }
                    }
                });
            }

            if (certificationIds.length > 0) {
                await tx.certification.deleteMany({
                    where: {
                        id: { in: certificationIds }
                    }
                });
            }

            if (sessionIds.length > 0) {
                await tx.chapitre.deleteMany({
                    where: {
                        sessionId: { in: sessionIds }
                    }
                });

                await tx.session.deleteMany({
                    where: {
                        id: { in: sessionIds }
                    }
                });
            }

            await tx.formation.delete({
                where: { id }
            });
        });
    }

    async findByProfesseurId(professeurId: number): Promise<Formation[]> {
        return await this.prisma.formation.findMany({
            where: { professeurId },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true,
                apprenants: true
            }
        });
    }

    // Mettre à jour le statut de la formation
    async updateStatut(id: number, statut: string): Promise<Formation> {
        return await this.prisma.formation.update({
            where: { id },
            data: { statut: statut as any }
        });
    }

    // Trouver les formations par statut
    async findByStatut(statut: string): Promise<Formation[]> {
        return await this.prisma.formation.findMany({
            where: { statut: "VALIDEE" },
            include: { 
                professeur: { include: { utilisateur: true } },
                sessions: true
            }
        });
    }
}
