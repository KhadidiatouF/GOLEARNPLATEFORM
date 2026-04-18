import { PaiementRepo } from "../repository/PaiementRepo";
import { MoyenPaiement, PrismaClient, StatutPaiement } from "@prisma/client";

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

    private normalizeWebhookStatus(payload: any): StatutPaiement {
        if (payload?.success === true || payload?.paid === true) {
            return StatutPaiement.VALIDE;
        }

        const rawStatus = String(
            payload?.status ??
            payload?.statut ??
            payload?.paymentStatus ??
            payload?.payment_status ??
            payload?.event ??
            ""
        ).toUpperCase();

        if ([
            "SUCCESS",
            "SUCCES",
            "SUCCEEDED",
            "SUCCESSFUL",
            "PAID",
            "COMPLETED",
            "COMPLETE",
            "VALIDE",
            "VALIDATED",
            "CONFIRMED"
        ].includes(rawStatus)) {
            return StatutPaiement.VALIDE;
        }

        if (["FAILED", "FAIL", "ERROR", "ECHOUE", "ECHEC", "DECLINED"].includes(rawStatus)) {
            return StatutPaiement.ECHOUE;
        }

        if (["CANCELLED", "CANCELED", "ANNULE", "ANNULATION", "EXPIRED"].includes(rawStatus)) {
            return StatutPaiement.ANNULE;
        }

        return StatutPaiement.EN_ATTENTE;
    }

    private isSimulatedInstantPayment(moyenPaiement: MoyenPaiement): boolean {
        return moyenPaiement === MoyenPaiement.WAVE || moyenPaiement === MoyenPaiement.OM;
    }

    async createPaiement(data: any, utilisateurId: number) {
        const apprenant = await this.prisma.apprenant.findUnique({
            where: { utilisateurId }
        });

        if (!apprenant) {
            throw new Error("Apprenant non trouve.");
        }

        const formation = await this.prisma.formation.findUnique({
            where: { id: data.formationId }
        });

        if (!formation) {
            throw new Error("Formation introuvable.");
        }

        if (formation.typeCours === "GRATUIT" || formation.prix === 0) {
            throw new Error("Cette formation ne necessite pas de paiement.");
        }

        const moyenPaiement = data.moyenPaiement as MoyenPaiement;

        let apprenantFormation = await this.prisma.apprenantFormation.findUnique({
            where: {
                apprenantId_formationId: {
                    apprenantId: apprenant.id,
                    formationId: formation.id
                }
            }
        });

        if (!apprenantFormation) {
            apprenantFormation = await this.prisma.apprenantFormation.create({
                data: {
                    apprenantId: apprenant.id,
                    formationId: formation.id
                }
            });
        }

        const existingPendingPayment = await this.prisma.paiement.findFirst({
            where: {
                apprenantFormationId: apprenantFormation.id,
                statut: StatutPaiement.EN_ATTENTE
            },
            orderBy: {
                datePaiement: "desc"
            }
        });

        if (existingPendingPayment) {
            if (this.isSimulatedInstantPayment(moyenPaiement)) {
                await this.confirmPaiement({
                    paiementId: existingPendingPayment.id,
                    reference: existingPendingPayment.reference,
                    transactionId: existingPendingPayment.transactionId || `SIM-${moyenPaiement}-${Date.now()}`,
                    status: "SUCCESS",
                    source: "SIMULATED_CHECKOUT",
                    success: true
                });

                return this.paiementRepo.findById(existingPendingPayment.id);
            }

            return existingPendingPayment;
        }

        const reference = data.reference || `PAY-${formation.id}-${apprenant.id}-${Date.now()}`;
        const pendingAmount = typeof data.montant === "number" ? data.montant : formation.prix;
        const paiement = await this.paiementRepo.create({
            montant: pendingAmount,
            moyenPaiement,
            statut: StatutPaiement.EN_ATTENTE,
            reference,
            apprenantFormation: {
                connect: { id: apprenantFormation.id }
            }
        });

        if (this.isSimulatedInstantPayment(moyenPaiement)) {
            await this.confirmPaiement({
                paiementId: paiement.id,
                reference: paiement.reference,
                transactionId: `SIM-${moyenPaiement}-${Date.now()}`,
                status: "SUCCESS",
                source: "SIMULATED_CHECKOUT",
                success: true
            });

            return this.paiementRepo.findById(paiement.id);
        }

        return paiement;
    }

    async confirmPaiement(data: any) {
        const paymentReference = data?.reference || data?.paymentReference || data?.externalReference;
        const paymentId = data?.paiementId ? Number(data.paiementId) : undefined;
        const targetPayment = paymentId
            ? await this.prisma.paiement.findUnique({
                where: { id: paymentId },
                include: {
                    apprenantFormation: {
                        include: {
                            formation: {
                                include: {
                                    professeur: true
                                }
                            }
                        }
                    }
                }
            })
            : paymentReference
                ? await this.prisma.paiement.findUnique({
                    where: { reference: paymentReference },
                    include: {
                        apprenantFormation: {
                            include: {
                                formation: {
                                    include: {
                                        professeur: true
                                    }
                                }
                            }
                        }
                    }
                })
                : null;

        if (!targetPayment) {
            throw new Error("Paiement introuvable pour ce webhook.");
        }

        if (targetPayment.statut === StatutPaiement.VALIDE) {
            return true;
        }

        const statut = this.normalizeWebhookStatus(data);
        const transactionId = data?.transactionId || data?.transaction_id || data?.providerTransactionId || null;

        if (statut !== StatutPaiement.VALIDE) {
            await this.paiementRepo.update(targetPayment.id, {
                statut,
                transactionId,
                callbackData: data
            });

            return false;
        }

        await this.prisma.$transaction(async (tx) => {
            const paiement = await tx.paiement.update({
                where: { id: targetPayment.id },
                data: {
                    statut: StatutPaiement.VALIDE,
                    transactionId,
                    reference: paymentReference || targetPayment.reference,
                    callbackData: data
                },
                include: {
                    apprenantFormation: {
                        include: {
                            formation: {
                                include: {
                                    professeur: true
                                }
                            }
                        }
                    }
                }
            });

            const formation = paiement.apprenantFormation.formation;
            const partProfesseur = Number((paiement.montant * 0.70).toFixed(2));
            const partPlateforme = Number((paiement.montant * 0.30).toFixed(2));

            await tx.progression.upsert({
                where: {
                    apprenantFormationId: paiement.apprenantFormationId
                },
                update: {},
                create: {
                    apprenantFormationId: paiement.apprenantFormationId
                }
            });

            if (formation.professeur?.utilisateurId) {
                await tx.utilisateur.update({
                    where: { id: formation.professeur.utilisateurId },
                    data: {
                        solde: {
                            increment: partProfesseur
                        }
                    }
                });
            }

            const platformAdmin = await tx.utilisateur.findFirst({
                where: { role: "ADMIN" },
                orderBy: { id: "asc" }
            });

            if (platformAdmin) {
                await tx.utilisateur.update({
                    where: { id: platformAdmin.id },
                    data: {
                        solde: {
                            increment: partPlateforme
                        }
                    }
                });
            }
        });

        return true;
    }

    updatePaiement(id: number, data: any) {
        return this.paiementRepo.update(id, data);
    }

    deletePaiement(id: number) {
        return this.paiementRepo.delete(id);
    }
}
