export declare class ProfesseurService {
    private professeurRepo;
    private prisma;
    constructor();
    getAllProfesseurs(): Promise<{
        data: import("@prisma/client").Professeur[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOneProfesseur(id: number): Promise<any>;
    createProfesseur(data: any): Promise<{
        id: number;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number;
        statut: import("@prisma/client").$Enums.StatutProfesseur;
    }>;
    updateProfesseur(id: number, data: any): Promise<{
        id: number;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number;
        statut: import("@prisma/client").$Enums.StatutProfesseur;
    }>;
    deleteProfesseur(id: number): Promise<void>;
    createDemandeProfesseur(data: any, utilisateurId?: number): Promise<{
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number | null;
        statut: import("@prisma/client").$Enums.StatutDemandeProfesseur;
        utilisateurCreeId: number | null;
        professeurCreeId: number | null;
        domaineExpertise: string;
        experience: string;
        motivation: string;
        loginGenere: string | null;
        dateTraitement: Date | null;
    }>;
    getAllDemandesProfesseur(): Promise<{
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number | null;
        statut: import("@prisma/client").$Enums.StatutDemandeProfesseur;
        utilisateurCreeId: number | null;
        professeurCreeId: number | null;
        domaineExpertise: string;
        experience: string;
        motivation: string;
        loginGenere: string | null;
        dateTraitement: Date | null;
    }[]>;
    getDemandesProfesseurEnAttente(): Promise<{
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number | null;
        statut: import("@prisma/client").$Enums.StatutDemandeProfesseur;
        utilisateurCreeId: number | null;
        professeurCreeId: number | null;
        domaineExpertise: string;
        experience: string;
        motivation: string;
        loginGenere: string | null;
        dateTraitement: Date | null;
    }[]>;
    private normalizeLoginPart;
    private generateTemporaryPassword;
    private generateUniqueLogin;
    validerDemandeProfesseur(id: number): Promise<{
        credentialsSent: boolean;
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number | null;
        statut: import("@prisma/client").$Enums.StatutDemandeProfesseur;
        utilisateurCreeId: number | null;
        professeurCreeId: number | null;
        domaineExpertise: string;
        experience: string;
        motivation: string;
        loginGenere: string | null;
        dateTraitement: Date | null;
    }>;
    rejeterDemandeProfesseur(id: number): Promise<{
        id: number;
        email: string;
        nom: string;
        prenom: string;
        dateCreation: Date;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number | null;
        statut: import("@prisma/client").$Enums.StatutDemandeProfesseur;
        utilisateurCreeId: number | null;
        professeurCreeId: number | null;
        domaineExpertise: string;
        experience: string;
        motivation: string;
        loginGenere: string | null;
        dateTraitement: Date | null;
    }>;
    validerProfesseur(id: number): Promise<{
        id: number;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number;
        statut: import("@prisma/client").$Enums.StatutProfesseur;
    }>;
    rejeterProfesseur(id: number): Promise<{
        id: number;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number;
        statut: import("@prisma/client").$Enums.StatutProfesseur;
    }>;
    getDemandesEnAttente(): Promise<{
        id: number;
        specialite: string | null;
        bio: string | null;
        utilisateurId: number;
        statut: import("@prisma/client").$Enums.StatutProfesseur;
    }[]>;
    getHistoriqueRevenus(professeurId: number): Promise<{
        id: number;
        date: Date;
        formationTitre: string;
        formationId: number;
        montantTotal: number;
        partProfesseur: number;
        apprenantNom: string;
        apprenantEmail: string;
    }[]>;
}
//# sourceMappingURL=ProfesseurService.d.ts.map