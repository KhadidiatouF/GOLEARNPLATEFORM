import { Router } from "express";
import { ProgressionController } from "../controllers/ProgressionController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Routes pour la progression avec authentification

// POST /api/progressions - Créer une progression
router.post("/", authenticate, ProgressionController.createProgression);

// GET /api/progressions/apprenant/:apprenantFormationId - Récupérer la progression
router.get("/apprenant/:apprenantFormationId", ProgressionController.getProgression);

// POST /api/progressions/complete - Marquer un chapitre comme complété
router.post("/complete", authenticate, ProgressionController.completeChapter);

// GET /api/progressions/professeur - Récupérer les progressions pour un professeur
router.get("/professeur", authenticate, ProgressionController.getProgressionByProfesseur);

export default router;
