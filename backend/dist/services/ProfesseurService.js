"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesseurService = void 0;
const ProfesseurRepo_1 = require("../repository/ProfesseurRepo");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const PasswordResetService_1 = require("./PasswordResetService");
const MailService_1 = require("./MailService");
class ProfesseurService {
    professeurRepo;
    prisma;
    constructor() {
        this.professeurRepo = new ProfesseurRepo_1.ProfesseurRepo();
        this.prisma = new client_1.PrismaClient();
    }
    getAllProfesseurs() {
        return this.professeurRepo.findAll();
    }
    getOneProfesseur(id) {
        return this.professeurRepo.findById(id);
    }
    createProfesseur(data) {
        return this.professeurRepo.create(data);
    }
    updateProfesseur(id, data) {
        return this.professeurRepo.update(id, data);
    }
    deleteProfesseur(id) {
        return this.professeurRepo.delete(id);
    }
    async createDemandeProfesseur(data, utilisateurId) {
        const existingPendingDemand = await this.prisma.demandeProfesseur.findFirst({
            where: {
                email: data.email,
                statut: client_1.StatutDemandeProfesseur.EN_ATTENTE
            }
        });
        if (existingPendingDemand) {
            throw new Error("Une demande est deja en attente pour cet email.");
        }
        return await this.prisma.demandeProfesseur.create({
            data: {
                nom: data.nom,
                prenom: data.prenom,
                email: data.email,
                domaineExpertise: data.domaineExpertise,
                experience: data.experience,
                motivation: data.motivation,
                specialite: data.specialite || data.domaineExpertise,
                bio: data.bio || data.motivation,
                utilisateurId: utilisateurId ?? null
            }
        });
    }
    async getAllDemandesProfesseur() {
        return await this.prisma.demandeProfesseur.findMany({
            orderBy: { dateCreation: "desc" }
        });
    }
    async getDemandesProfesseurEnAttente() {
        return await this.prisma.demandeProfesseur.findMany({
            where: { statut: client_1.StatutDemandeProfesseur.EN_ATTENTE },
            orderBy: { dateCreation: "desc" }
        });
    }
    normalizeLoginPart(value) {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
    }
    generateTemporaryPassword() {
        const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
        const bytes = crypto_1.default.randomBytes(14);
        let password = "";
        for (let i = 0; i < 14; i += 1) {
            password += charset[(bytes[i] ?? 0) % charset.length];
        }
        return password;
    }
    async generateUniqueLogin(client, nom, prenom, email) {
        const baseFromName = `${this.normalizeLoginPart(prenom)}.${this.normalizeLoginPart(nom)}`.replace(/^\.+|\.+$/g, "");
        const emailPrefix = this.normalizeLoginPart(email.split("@")[0] || "prof");
        const baseLogin = (baseFromName || emailPrefix || "prof").slice(0, 18);
        let candidate = baseLogin || "prof";
        let suffix = 1;
        while (await client.utilisateur.findUnique({ where: { login: candidate } })) {
            candidate = `${baseLogin.slice(0, 14)}${String(suffix).padStart(2, "0")}`;
            suffix += 1;
        }
        return candidate;
    }
    async validerDemandeProfesseur(id) {
        const demande = await this.prisma.demandeProfesseur.findUnique({
            where: { id }
        });
        if (!demande) {
            throw new Error("Demande professeur introuvable.");
        }
        if (demande.statut !== client_1.StatutDemandeProfesseur.EN_ATTENTE) {
            throw new Error("Cette demande a deja ete traitee.");
        }
        const temporaryPassword = this.generateTemporaryPassword();
        const hashedPassword = await bcryptjs_1.default.hash(temporaryPassword, 10);
        const userLinkedToRequest = demande.utilisateurId
            ? await this.prisma.utilisateur.findUnique({ where: { id: demande.utilisateurId } })
            : null;
        const userWithSameEmail = await this.prisma.utilisateur.findUnique({
            where: { email: demande.email }
        });
        if (userLinkedToRequest && userWithSameEmail && userLinkedToRequest.id !== userWithSameEmail.id) {
            throw new Error("Un autre compte utilise deja cette adresse email.");
        }
        const targetUser = userLinkedToRequest || userWithSameEmail;
        const result = await this.prisma.$transaction(async (tx) => {
            let utilisateurId;
            let professeurId;
            let login;
            if (targetUser) {
                const updatedUser = await tx.utilisateur.update({
                    where: { id: targetUser.id },
                    data: {
                        nom: demande.nom,
                        prenom: demande.prenom,
                        email: demande.email,
                        role: client_1.Role.PROF,
                        mdp: hashedPassword,
                        solde: targetUser.solde ?? 0
                    }
                });
                const professeur = await tx.professeur.upsert({
                    where: { utilisateurId: updatedUser.id },
                    update: {
                        specialite: demande.specialite || demande.domaineExpertise,
                        bio: demande.bio || demande.motivation,
                        statut: client_1.StatutProfesseur.VALIDE
                    },
                    create: {
                        utilisateurId: updatedUser.id,
                        specialite: demande.specialite || demande.domaineExpertise,
                        bio: demande.bio || demande.motivation,
                        statut: client_1.StatutProfesseur.VALIDE
                    }
                });
                utilisateurId = updatedUser.id;
                professeurId = professeur.id;
                login = updatedUser.login;
            }
            else {
                login = await this.generateUniqueLogin(tx, demande.nom, demande.prenom, demande.email);
                const createdUser = await tx.utilisateur.create({
                    data: {
                        nom: demande.nom,
                        prenom: demande.prenom,
                        email: demande.email,
                        login,
                        mdp: hashedPassword,
                        role: client_1.Role.PROF,
                        solde: 0
                    }
                });
                const professeur = await tx.professeur.create({
                    data: {
                        utilisateurId: createdUser.id,
                        specialite: demande.specialite || demande.domaineExpertise,
                        bio: demande.bio || demande.motivation,
                        statut: client_1.StatutProfesseur.VALIDE
                    }
                });
                utilisateurId = createdUser.id;
                professeurId = professeur.id;
            }
            const updatedDemande = await tx.demandeProfesseur.update({
                where: { id: demande.id },
                data: {
                    statut: client_1.StatutDemandeProfesseur.APPROUVEE,
                    dateTraitement: new Date(),
                    utilisateurCreeId: utilisateurId,
                    professeurCreeId: professeurId,
                    loginGenere: login
                }
            });
            return {
                demande: updatedDemande,
                utilisateurId,
                login
            };
        });
        const resetData = await PasswordResetService_1.PasswordResetService.issueToken(result.utilisateurId);
        await MailService_1.MailService.sendProfessorCredentialsEmail({
            recipientEmail: demande.email,
            recipientName: `${demande.prenom} ${demande.nom}`.trim(),
            login: result.login,
            temporaryPassword,
            resetLink: resetData.resetLink
        });
        return {
            ...result.demande,
            credentialsSent: true
        };
    }
    async rejeterDemandeProfesseur(id) {
        const demande = await this.prisma.demandeProfesseur.findUnique({
            where: { id }
        });
        if (!demande) {
            throw new Error("Demande professeur introuvable.");
        }
        if (demande.statut !== client_1.StatutDemandeProfesseur.EN_ATTENTE) {
            throw new Error("Cette demande a deja ete traitee.");
        }
        return await this.prisma.demandeProfesseur.update({
            where: { id },
            data: {
                statut: client_1.StatutDemandeProfesseur.REJETEE,
                dateTraitement: new Date()
            }
        });
    }
    // Valider un professeur
    async validerProfesseur(id) {
        return await this.professeurRepo.updateStatut(id, 'VALIDE');
    }
    // Rejeter un professeur
    async rejeterProfesseur(id) {
        return await this.professeurRepo.updateStatut(id, 'REJETE');
    }
    // Récupérer les demandes en attente
    getDemandesEnAttente() {
        return this.professeurRepo.findByStatut('EN_ATTENTE');
    }
    // Récupérer l'historique des revenus du professeur
    async getHistoriqueRevenus(professeurId) {
        const paiements = await this.prisma.paiement.findMany({
            where: {
                statut: "VALIDE",
                apprenantFormation: {
                    formation: {
                        professeurId
                    }
                }
            },
            include: {
                apprenantFormation: {
                    include: {
                        formation: true,
                        apprenant: {
                            include: {
                                utilisateur: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                datePaiement: "desc"
            }
        });
        return paiements.map((paiement) => ({
            id: paiement.id,
            date: paiement.datePaiement,
            formationTitre: paiement.apprenantFormation.formation.titre,
            formationId: paiement.apprenantFormation.formationId,
            montantTotal: paiement.montant,
            partProfesseur: Number((paiement.montant * 0.70).toFixed(2)),
            apprenantNom: `${paiement.apprenantFormation.apprenant.utilisateur.prenom} ${paiement.apprenantFormation.apprenant.utilisateur.nom}`.trim(),
            apprenantEmail: paiement.apprenantFormation.apprenant.utilisateur.email
        }));
    }
}
exports.ProfesseurService = ProfesseurService;
//# sourceMappingURL=ProfesseurService.js.map