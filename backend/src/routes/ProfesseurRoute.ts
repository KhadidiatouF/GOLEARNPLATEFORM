import { Router } from "express";
import {ProfesseurController} from "../controllers/ProfesseurController";

const router = Router();


router.get("/",ProfesseurController.getAllProfesseurs)
router.get("/:id",ProfesseurController.getOneProfesseur)
router.post("/",ProfesseurController.createProfesseur)
router.put("/:id",ProfesseurController.updateProfesseur)
router.delete("/:id",ProfesseurController.deleteProfesseur)

export default router
