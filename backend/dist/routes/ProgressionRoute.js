"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProgressionController_1 = require("../controllers/ProgressionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Routes pour la progression avec authentification
// POST /api/progressions - Créer une progression
router.post("/", auth_1.authenticate, ProgressionController_1.ProgressionController.createProgression);
// GET /api/progressions/apprenant/:apprenantFormationId - Récupérer la progression
router.get("/apprenant/:apprenantFormationId", ProgressionController_1.ProgressionController.getProgression);
// POST /api/progressions/complete - Marquer un chapitre comme complété
router.post("/complete", auth_1.authenticate, ProgressionController_1.ProgressionController.completeChapter);
// GET /api/progressions/professeur - Récupérer les progressions pour un professeur
router.get("/professeur", auth_1.authenticate, ProgressionController_1.ProgressionController.getProgressionByProfesseur);
exports.default = router;
//# sourceMappingURL=ProgressionRoute.js.map