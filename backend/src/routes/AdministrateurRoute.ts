import { Router } from "express";
import { AdministrateurController } from "../controllers/AdministrateurController";

const router = Router();

router.get("/", AdministrateurController.getAllAdministrateurs);
router.get("/:id", AdministrateurController.getOneAdministrateur);
router.post("/", AdministrateurController.createAdministrateur);
router.put("/:id", AdministrateurController.updateAdministrateur);
router.delete("/:id", AdministrateurController.deleteAdministrateur);

export default router;
