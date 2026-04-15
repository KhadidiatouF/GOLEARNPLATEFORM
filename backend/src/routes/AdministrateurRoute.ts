import { Router } from "express";
import { AdministrateurController } from "../controllers/AdministrateurController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, AdministrateurController.getAllAdministrateurs);
router.get("/statistics", authenticate, AdministrateurController.getStatistics);
router.get("/:id", authenticate, AdministrateurController.getOneAdministrateur);
router.post("/", authenticate, AdministrateurController.createAdministrateur);
router.put("/:id", authenticate, AdministrateurController.updateAdministrateur);
router.delete("/:id", authenticate, AdministrateurController.deleteAdministrateur);

export default router;
