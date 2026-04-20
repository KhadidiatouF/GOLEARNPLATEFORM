import { Router } from "express";
import { ApprenantController } from "../controllers/ApprenantController";
import { authenticate } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, ApprenantController.getAllApprenants)
router.get("/:id", authenticate, ApprenantController.getOneApprenant)

// Route pour récupérer les formations d'un apprenant par son ID utilisateur
router.get("/by-user/:userId/formations", authenticate, async (req, res) => {
    try {
        const idParam = req.params.userId;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }
        const userId = parseInt(idParam);
        
        // D'abord, trouver l'apprenant par utilisateurId
        const apprenant = await prisma.apprenant.findUnique({
            where: { utilisateurId: userId }
        });
        
        if (!apprenant) {
            return res.json({ success: true, data: [] });
        }
        
        const apprenantId = apprenant.id;
        
        // Récupérer les formations auxquelles l'apprenant est inscrit
        const inscriptions = await prisma.apprenantFormation.findMany({
            where: {
                apprenantId,
                OR: [
                    {
                        formation: {
                            typeCours: 'GRATUIT'
                        }
                    },
                    {
                        paiements: {
                            some: {
                                statut: 'VALIDE'
                            }
                        }
                    }
                ]
            },
            include: {
                formation: {
                    include: {
                        professeur: {
                            include: { utilisateur: true }
                        }
                    }
                },
                progression: {
                    include: { chapitresCompletes: true }
                }
            }
        });
        
        // Calculer le nombre de chapitres total par formation
        const formations = await Promise.all(inscriptions.map(async inscription => {
            const totalChapitres = await prisma.chapitre.count({
                where: { session: { formationId: inscription.formationId } }
            });
            const completeCount = inscription.progression?.chapitresCompletes.length || 0;
            const progress = totalChapitres > 0 ? Math.round((completeCount / totalChapitres) * 100) : 0;
            
            return {
                apprenantFormationId: inscription.id,
                id: inscription.formation.id,
                title: inscription.formation.titre,
                professor: `${inscription.formation.professeur?.utilisateur?.prenom || ""} ${inscription.formation.professeur?.utilisateur?.nom || "Inconnu"}`.trim(),
                duration: `${inscription.formation.niveau || "N/A"}`,
                image: inscription.formation.image,
                dateInscription: inscription.progression?.dateDerniereActivite?.toString() || new Date().toString(),
                progress: progress,
                price: inscription.formation.prix,
                typeCours: inscription.formation.typeCours
            };
        }));
        
        res.json({ success: true, data: formations });
    } catch (error) {
        console.error("Erreur récupération formations:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Ancienne route (gardée pour compatibilité): récupérer les formations d'un apprenant avec son ID
router.get("/:id/formations", authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const apprenantId = parseInt(id);
        
        // Récupérer les formations auxquelles l'apprenant est inscrit
        const inscriptions = await prisma.apprenantFormation.findMany({
            where: {
                apprenantId,
                OR: [
                    {
                        formation: {
                            typeCours: 'GRATUIT'
                        }
                    },
                    {
                        paiements: {
                            some: {
                                statut: 'VALIDE'
                            }
                        }
                    }
                ]
            },
            include: {
                formation: {
                    include: {
                        professeur: {
                            include: { utilisateur: true }
                        }
                    }
                },
                progression: {
                    include: { chapitresCompletes: true }
                }
            }
        });
        
        // Calculer le nombre de chapitres total par formation
        const formations = await Promise.all(inscriptions.map(async inscription => {
            const totalChapitres = await prisma.chapitre.count({
                where: { session: { formationId: inscription.formationId } }
            });
            const completeCount = inscription.progression?.chapitresCompletes.length || 0;
            const progress = totalChapitres > 0 ? Math.round((completeCount / totalChapitres) * 100) : 0;
            
            return {
                apprenantFormationId: inscription.id,
                id: inscription.formation.id,
                title: inscription.formation.titre,
                professor: `${inscription.formation.professeur?.utilisateur?.prenom || ""} ${inscription.formation.professeur?.utilisateur?.nom || "Inconnu"}`.trim(),
                duration: `${inscription.formation.niveau || "N/A"}`,
                image: inscription.formation.image,
                dateInscription: inscription.progression?.dateDerniereActivite?.toString() || new Date().toString(),
                progress: progress,
                price: inscription.formation.prix,
                typeCours: inscription.formation.typeCours
            };
        }));
        
        res.json({ success: true, data: formations });
    } catch (error) {
        console.error("Erreur récupération formations:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post("/", authenticate, ApprenantController.createApprenant)
router.put("/:id", authenticate, ApprenantController.updateApprenant)
router.delete("/:id", authenticate, ApprenantController.deleteApprenant)

export default router
