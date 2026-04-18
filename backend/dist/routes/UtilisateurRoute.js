"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UtilisateurController_1 = require("../controllers/UtilisateurController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, UtilisateurController_1.UtilisateurController.getAllUsers);
// Route pour récupérer le profil de l'utilisateur connecté (avec son solde)
router.get("/moi", auth_1.authenticate, UtilisateurController_1.UtilisateurController.getMonProfil);
router.get("/:id", auth_1.authenticate, UtilisateurController_1.UtilisateurController.getOneUser);
// Inscription - pas d'authentification requise
router.post("/", UtilisateurController_1.UtilisateurController.createUser);
router.put("/:id", auth_1.authenticate, UtilisateurController_1.UtilisateurController.updateUser);
router.delete("/:id", auth_1.authenticate, UtilisateurController_1.UtilisateurController.deleteUser);
exports.default = router;
//# sourceMappingURL=UtilisateurRoute.js.map