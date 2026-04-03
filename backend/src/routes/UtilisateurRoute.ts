import { Router } from "express";
import { UtilisateurController } from "../controllers/UtilisateurController";
import { authenticate } from "../middlewares/auth";

const router = Router();


router.get("/", authenticate, UtilisateurController.getAllUsers)
// Route pour récupérer le profil de l'utilisateur connecté (avec son solde)
router.get("/moi", authenticate, UtilisateurController.getMonProfil)
router.get("/:id", authenticate, UtilisateurController.getOneUser)
// Inscription - pas d'authentification requise
router.post("/", UtilisateurController.createUser)
router.put("/:id", authenticate, UtilisateurController.updateUser)
router.delete("/:id", authenticate, UtilisateurController.deleteUser)

export default router





