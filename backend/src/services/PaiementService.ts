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
        // Créer le paiement
        const paiement = await this.paiementRepo.create(data);

        // Si le paiement est réussi, créditer le professeur
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

                // ✅ Ajouter l'apprenant à la formation pour lui donner accès
                // Sécurité: si formationId n'est pas dans data, le récupérer depuis la formation
                const formationIdToAdd = data.formationId || formation.id;
                
                await this.prisma.apprenantFormation.create({
                    data: {
                        apprenantId: data.apprenantId,
                        formationId: formationIdToAdd
                    }
                });
            }
        return paiement;
    }

    updatePaiement(id: number, data: any) {
        return this.paiementRepo.update(id, data);
    }

    deletePaiement(id: number) {
        return this.paiementRepo.delete(id);
    }
}
