import { Router } from "express";
import { UtilisateurController } from "../controllers/UtilisateurController";

const router = Router();


router.get("/", UtilisateurController.getAllUsers)
router.get("/:id", UtilisateurController.getOneUser)
router.post("/", UtilisateurController.createUser)
router.put("/:id", UtilisateurController.updateUser)
router.delete("/:id", UtilisateurController.deleteUser)

export default router





