import { PaiementRepo } from "../repository/PaiementRepo";
import { PrismaClient } from "@prisma/client";

export class PaiementService {
    private paiementRepo: PaiementRepo;
    private prisma: PrismaClient;

    constructor() {
        this.paiementRepo = new PaiementRepo();
        this.prisma = new PrismaClient();
    }

    getAllPaiements() {
        return this.paiementRepo.findAll();
    }

    getOnePaiement(id: number) {
        return this.paiementRepo.findById(id);
    }

    

    async createPaiement(data: any) {
        // Créer le paiement avec statut en attente
        // AUCUN PARTAGE, AUCUN ACCES ICI
        return await this.paiementRepo.create(data);
    }

    async confirmPaiement(data: any) {
        // ✅ SEULEMENT ICI APRES CONFIRMATION WEBHOOK
        // On ne fait le partage que quand Orange Money confirme le paiement

        // ✅ Mettre à jour le statut du paiement en VALIDE
        await this.paiementRepo.update(data.paiementId, {
            statut: 'VALIDE',
            transactionId: data.transactionId,
            reference: data.reference,
            callbackData: data
        });
        
        // Récupérer la formation pour obtenir le professeur
        const formation = await this.prisma.formation.findUnique({
            where: { id: data.formationId },
            include: { professeur: { include: { utilisateur: true } } }
        });

        if (formation && formation.professeur) {
            // Calculer le partage des revenus (70% pour le professeur, 30% pour la plateforme)
            const montant = typeof data.montant === 'number' ? data.montant : parseFloat(data.montant);
            const partProfesseur = montant * 0.70;
            const partPlateforme = montant * 0.30;

            // ✅ Créditer le solde du professeur (70%)
            await this.prisma.utilisateur.update({
                where: { id: formation.professeur.utilisateurId },
                data: {
                    solde: {
                        increment: partProfesseur
                    }
                }
            });

            // ✅ Créditer le solde de l'administrateur (30%)
            await this.prisma.utilisateur.updateMany({
                where: { role: 'ADMIN' },
                data: {
                    solde: {
                        increment: partPlateforme
                    }
                }
            });

            // ✅ Ajouter l'apprenant à la formation pour lui donner accès (déblocage automatique)
            await this.prisma.apprenantFormation.create({
                data: {
                    apprenantId: data.apprenantId,
                    formationId: data.formationId
                }
            });
        }

        return true;
    }

    updatePaiement(id: number, data: any) {
        return this.paiementRepo.update(id, data);
    }

    deletePaiement(id: number) {
        return this.paiementRepo.delete(id);
    }
}
