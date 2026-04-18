"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FormationController_1 = require("../controllers/FormationController");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Routes publiques - Sans authentification (pour la page publique à tous)
router.get("/publiques", FormationController_1.FormationController.getFormationsPubliques);
router.get("/:id", FormationController_1.FormationController.getOneFormation);
// Routes avec authentification
router.get("/", auth_1.authenticate, FormationController_1.FormationController.getAllFormations);
// Route pour s'inscrire à une formation
router.post("/:id/inscrire", auth_1.authenticate, async (req, res) => {
    try {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const formationId = parseInt(idParam);
        // Le user est ajouté par le middleware d'authentification
        const userId = req.user?.id;
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
    }
    catch (error) {
        console.error("Erreur inscription:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
router.post("/", auth_1.authenticate, FormationController_1.FormationController.createFormation);
router.post("/complete", auth_1.authenticate, FormationController_1.FormationController.createCompleteFormation);
router.put("/:id", auth_1.authenticate, FormationController_1.FormationController.updateFormation);
router.delete("/:id", auth_1.authenticate, FormationController_1.FormationController.deleteFormation);
// Routes pour la validation par l'admin
router.get("/demandes/en-attente", auth_1.authenticate, FormationController_1.FormationController.getFormationsEnAttente);
router.put("/:id/valider", auth_1.authenticate, FormationController_1.FormationController.validerFormation);
router.put("/:id/rejeter", auth_1.authenticate, FormationController_1.FormationController.rejeterFormation);
exports.default = router;
//# sourceMappingURL=FormationRoute.js.map