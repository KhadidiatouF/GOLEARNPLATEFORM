import { FormationRepo } from "../repository/FormationRepo";
import { Role, PrismaClient, TypeContenu } from "@prisma/client";
import { CompleteFormationData } from "../validators/FormationValidator";

export interface UserContext {
    id: number;
    role: Role;
    professeurId?: number | undefined;
}

export class FormationService {
    private formationRepo: FormationRepo;
    private prisma: PrismaClient;

    constructor() {
        this.formationRepo = new FormationRepo();
        this.prisma = new PrismaClient();
    }

    // LOGIQUE MÉTIER : filtrage selon le rôle
    async getFormations(userContext: UserContext) {
        // ADMIN : voir toutes les formations
        if (userContext.role === Role.ADMIN) {
            return await this.formationRepo.findAll();
        }
        
        // PROF : voir uniquement ses propres formations
        if (userContext.role === Role.PROF && userContext.professeurId) {
            return await this.formationRepo.findByProfesseurId(userContext.professeurId);
        }
        
        // APPRENANT : voir toutes les formations (ou selon votre logique)
        return await this.formationRepo.findAll();
    }

    getAllFormations() {
        return this.formationRepo.findAll();
    }

    getOneFormation(id: number) {
        return this.formationRepo.findById(id);
    }

    createFormation(data: any) {
        return this.formationRepo.create(data);
    }

    updateFormation(id: number, data: any) {
        return this.formationRepo.update(id, data);
    }

    deleteFormation(id: number) {
        return this.formationRepo.delete(id);
    }

    /**
     * CRÉATION COMPLÈTE AVEC TRANSACTION SQL
     * 
     * Crée une formation avec :
     * - Sessions (modules)
     * - Quiz pour chaque session
     * - Questions pour chaque quiz
     * - Réponses pour chaque question
     * 
     * Si une opération échoue, tout est annulé (rollback)
     */
    async createCompleteFormation(data: CompleteFormationData) {
        return await this.prisma.$transaction(async (prisma) => {
            // 1. Créer la formation
            const formation = await prisma.formation.create({
                data: {
                    titre: data.titre,
                    description: data.description,
                    prix: data.prix,
                    categorie: data.categorie,
                    niveau: data.niveau,
            image: data.image || null,
                    typeCours: data.typeCours,
                    professeurId: data.professeurId
                }
            });

            // 2. Pour chaque session, créer session + chapitres + quiz + questions + réponses
            for (const sessionData of data.sessions) {
                // Créer la session
                const session = await prisma.session.create({
                    data: {
                        titre: sessionData.titre,
                        contenu: sessionData.contenu || "",
                        duree: sessionData.duree || "0",
                        formationId: formation.id
                    }
                });

                // Si des chapitres sont fournis, les créer
                if (sessionData.chapitres && sessionData.chapitres.length > 0) {
                    for (const chapitreData of sessionData.chapitres) {
                        await prisma.chapitre.create({
                            data: {
                                titre: chapitreData.titre,
                                contenu: chapitreData.contenu,
                                duree: chapitreData.duree,
                                typeContenu: chapitreData.typeContenu,
                                ordre: chapitreData.ordre || 0,
                                sessionId: session.id
                            }
                        });
                    }
                }

                // Si un quiz est fourni, le créer avec ses questions et réponses
                if (sessionData.quiz) {
                    const quiz = await prisma.quiz.create({
                        data: {
                            formationId: formation.id,
                            sessionId: session.id
                        }
                    });

                    // Créer les questions et leurs réponses
                    for (const questionData of sessionData.quiz.questions) {
                        const question = await prisma.question.create({
                            data: {
                                contenu: questionData.contenu,
                                quizId: quiz.id
                            }
                        });

                        // Créer les réponses
                        for (const reponseData of questionData.reponses) {
                            await prisma.reponse.create({
                                data: {
                                    contenu: reponseData.contenu,
                                    estCorrecte: reponseData.estCorrecte,
                                    questionId: question.id
                                }
                            });
                        }
                    }
                }
            }

            // Retourner la formation créée avec toutes ses données
            return await prisma.formation.findUnique({
                where: { id: formation.id },
                include: {
                    professeur: { include: { utilisateur: true } },
                    sessions: {
                        include: {
                            quiz: {
                                include: {
                                    questions: {
                                        include: { reponses: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    }
}
