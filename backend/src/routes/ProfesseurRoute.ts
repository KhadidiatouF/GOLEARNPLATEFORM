import { Router } from "express";
import { Role } from "@prisma/client";
import { ProfessController } from "../controllers/ProfesseurController";
import { authenticate } from "../middlewares/auth";
import { roleMiddleware } from "../middlewares/roleMiddlewares";

const router = Router();

router.post("/demandes", ProfessController.createDemandeProfesseur);
router.get("/demandes", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.getAllDemandesProfesseur);
router.get("/demandes/en-attente", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.getDemandesEnAttente);
router.put("/demandes/:id/valider", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.validerDemandeProfesseur);
router.put("/demandes/:id/rejeter", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.rejeterDemandeProfesseur);
router.get("/revenus/historique", authenticate, roleMiddleware([Role.PROF]), ProfessController.getHistoriqueRevenus);

router.get("/", authenticate, ProfessController.getAllProfesseurs)
router.get("/:id", authenticate, ProfessController.getOneProfesseur)
router.post("/", authenticate, ProfessController.createProfesseur)
router.put("/:id", authenticate, ProfessController.updateProfesseur)
router.delete("/:id", authenticate, ProfessController.deleteProfesseur)

// Routes pour la validation par l'admin
router.put("/:id/valider", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.validerProfesseur)
router.put("/:id/rejeter", authenticate, roleMiddleware([Role.ADMIN]), ProfessController.rejeterProfesseur)

export default router
