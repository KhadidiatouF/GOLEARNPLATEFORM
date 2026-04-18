import { Role } from "@prisma/client";
import { CompleteFormationData } from "../validators/FormationValidator";
export interface UserContext {
    id: number;
    role: Role;
    professeurId?: number | undefined;
}
export declare class FormationService {
    private formationRepo;
    private prisma;
    constructor();
    getFormations(userContext: UserContext): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }[]>;
    getAllFormations(page?: number, limit?: number): Promise<{
        data: import("@prisma/client").Formation[];
        total: number;
        page: number;
        limit: number;
    }>;
    getFormationsPubliques(): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }[]>;
    getOneFormation(id: number): Promise<any>;
    createFormation(data: any): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }>;
    updateFormation(id: number, data: any): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }>;
    deleteFormation(id: number): Promise<void>;
    validerFormation(id: number): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }>;
    rejeterFormation(id: number): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }>;
    getFormationsEnAttente(): Promise<{
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }[]>;
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
    createCompleteFormation(data: CompleteFormationData): Promise<({
        professeur: {
            utilisateur: {
                login: string;
                mdp: string;
                id: number;
                email: string;
                nom: string;
                prenom: string;
                dateCreation: Date;
                role: import("@prisma/client").$Enums.Role;
                solde: number | null;
            };
        } & {
            id: number;
            specialite: string | null;
            bio: string | null;
            utilisateurId: number;
            statut: import("@prisma/client").$Enums.StatutProfesseur;
        };
        sessions: ({
            quiz: ({
                questions: ({
                    reponses: {
                        id: number;
                        contenu: string;
                        estCorrecte: boolean;
                        questionId: number;
                    }[];
                } & {
                    id: number;
                    contenu: string;
                    quizId: number;
                })[];
            } & {
                type: import("@prisma/client").$Enums.TypeQuiz;
                id: number;
                formationId: number;
                score: number | null;
                sessionId: number | null;
            }) | null;
        } & {
            id: number;
            formationId: number;
            titre: string;
            contenu: string | null;
            duree: string;
        })[];
    } & {
        id: number;
        dateCreation: Date;
        statut: import("@prisma/client").$Enums.StatutFormation;
        niveau: string;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        image: string | null;
        typeCours: import("@prisma/client").$Enums.TypeCours;
        professeurId: number;
    }) | null>;
}
//# sourceMappingURL=FormationService.d.ts.map