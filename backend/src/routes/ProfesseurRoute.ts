import { Router } from "express";
import { ProfessController } from "../controllers/ProfesseurController";
import { authenticate } from "../middlewares/auth";

const router = Router();


router.get("/", authenticate, ProfessController.getAllProfesseurs)
router.get("/:id", authenticate, ProfessController.getOneProfesseur)
router.post("/", authenticate, ProfessController.createProfesseur)
router.put("/:id", authenticate, ProfessController.updateProfesseur)
router.delete("/:id", authenticate, ProfessController.deleteProfesseur)

// Routes pour la validation par l'admin
router.get("/demandes/en-attente", authenticate, ProfessController.getDemandesEnAttente)
router.put("/:id/valider", authenticate, ProfessController.validerProfesseur)
router.put("/:id/rejeter", authenticate, ProfessController.rejeterProfesseur)

export default router
