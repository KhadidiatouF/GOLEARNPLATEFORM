import { Router } from "express";
import { FormationController } from "../controllers/FormationController";
import { authenticate } from "../middlewares/auth";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Routes publiques - Sans authentification (pour la page publique à tous)
router.get("/publiques", FormationController.getFormationsPubliques);
router.get("/:id", FormationController.getOneFormation);

// Routes avec authentification
router.get("/", authenticate, FormationController.getAllFormations);

// Route pour s'inscrire à une formation
router.post("/:id/inscrire", authenticate, async (req, res) => {
    try {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const formationId = parseInt(idParam);
        
        // Le user est ajouté par le middleware d'authentification
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: "Non autorisé" });
        }
        
        // Trouver l'apprenant par userId
        const apprenant = await prisma.apprenant.findUnique({
            where: { utilisateurId: userId }
        });
        
        if (!apprenant) {
            return res.status(404).json({ error: "Apprenant non trouvé" });
        }

        const formation = await prisma.formation.findUnique({
            where: { id: formationId }
        });

        if (!formation) {
            return res.status(404).json({ error: "Formation non trouvée" });
        }

        if (formation.typeCours !== 'GRATUIT' && formation.prix > 0) {
            return res.status(403).json({
                error: "Le déblocage d'une formation payante se fait uniquement après validation du paiement."
            });
        }
        
        // Vérifier si déjà inscrit
        const existing = await prisma.apprenantFormation.findFirst({
            where: { apprenantId: apprenant.id, formationId }
        });
        if (existing) {
            return res.status(400).json({ error: "Déjà inscrit à cette formation" });
        }
        
        // Créer l'inscription
        const inscription = await prisma.apprenantFormation.create({
            data: {
                apprenantId: apprenant.id,
                formationId: formationId
            }
        });
        
        // Créer la progression
        await prisma.progression.create({
            data: { apprenantFormationId: inscription.id }
        });
        
        res.json({ success: true, data: inscription });
    } catch (error) {
        console.error("Erreur inscription:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post("/", authenticate, FormationController.createFormation);
router.post("/complete", authenticate, FormationController.createCompleteFormation);
router.put("/:id", authenticate, FormationController.updateFormation);
router.delete("/:id", authenticate, FormationController.deleteFormation);

// Routes pour la validation par l'admin
router.get("/demandes/en-attente", authenticate, FormationController.getFormationsEnAttente);
router.put("/:id/valider", authenticate, FormationController.validerFormation);
router.put("/:id/rejeter", authenticate, FormationController.rejeterFormation);

export default router;
