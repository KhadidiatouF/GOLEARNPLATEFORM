"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationService = void 0;
const FormationRepo_1 = require("../repository/FormationRepo");
const client_1 = require("@prisma/client");
class FormationService {
    formationRepo;
    prisma;
    constructor() {
        this.formationRepo = new FormationRepo_1.FormationRepo();
        this.prisma = new client_1.PrismaClient();
    }
    // LOGIQUE MÉTIER : filtrage selon le rôle
    async getFormations(userContext) {
        // ADMIN : voir toutes les formations
        if (userContext.role === client_1.Role.ADMIN) {
            const result = await this.formationRepo.findAll();
            return result.data;
        }
        // PROF : voir uniquement ses propres formations
        if (userContext.role === client_1.Role.PROF && userContext.professeurId) {
            return await this.formationRepo.findByProfesseurId(userContext.professeurId);
        }
        // APPRENANT : voir toutes les formations (ou selon votre logique)
        const result = await this.formationRepo.findAll();
        return result.data;
    }
    getAllFormations(page = 1, limit = 10) {
        return this.formationRepo.findAll(page, limit);
    }
    // Retourne uniquement les formations validées (pour le grand public)
    getFormationsPubliques() {
        return this.formationRepo.findByStatut('VALIDE');
    }
    getOneFormation(id) {
        return this.formationRepo.findById(id);
    }
    createFormation(data) {
        return this.formationRepo.create(data);
    }
    updateFormation(id, data) {
        return this.formationRepo.update(id, data);
    }
    deleteFormation(id) {
        return this.formationRepo.delete(id);
    }
    // Valider une formation
    async validerFormation(id) {
        return await this.formationRepo.updateStatut(id, 'VALIDEE');
    }
    // Rejeter une formation
    async rejeterFormation(id) {
        return await this.formationRepo.updateStatut(id, 'REJETEE');
    }
    // Récupérer les formations en attente de validation
    getFormationsEnAttente() {
        return this.formationRepo.findByStatut('EN_ATTENTE');
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
    async createCompleteFormation(data) {
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
                                typeContenu: chapitreData.typeContenu || 'VIDEO',
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
            // ✅ CRÉATION AUTOMATIQUE DU QUIZ FINAL
            // Créé silencieusement à la fin de la transaction, aucun changement sur l'existant
            if (data.quizFinal && data.quizFinal.questions && data.quizFinal.questions.length > 0) {
                const finalQuiz = await prisma.quiz.create({
                    data: {
                        formationId: formation.id,
                        type: 'FINAL',
                        questions: {
                            create: data.quizFinal.questions.map((questionData) => ({
                                contenu: questionData.contenu,
                                reponses: {
                                    create: questionData.reponses.map((reponseData) => ({
                                        contenu: reponseData.contenu,
                                        estCorrecte: reponseData.estCorrecte
                                    }))
                                }
                            }))
                        }
                    }
                });
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
exports.FormationService = FormationService;
//# sourceMappingURL=FormationService.js.map