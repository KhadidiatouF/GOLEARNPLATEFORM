"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const ProfesseurController_1 = require("../controllers/ProfesseurController");
const auth_1 = require("../middlewares/auth");
const roleMiddlewares_1 = require("../middlewares/roleMiddlewares");
const router = (0, express_1.Router)();
router.post("/demandes", ProfesseurController_1.ProfessController.createDemandeProfesseur);
router.get("/demandes", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.getAllDemandesProfesseur);
router.get("/demandes/en-attente", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.getDemandesEnAttente);
router.put("/demandes/:id/valider", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.validerDemandeProfesseur);
router.put("/demandes/:id/rejeter", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.rejeterDemandeProfesseur);
router.get("/revenus/historique", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.PROF]), ProfesseurController_1.ProfessController.getHistoriqueRevenus);
router.get("/", auth_1.authenticate, ProfesseurController_1.ProfessController.getAllProfesseurs);
router.get("/:id", auth_1.authenticate, ProfesseurController_1.ProfessController.getOneProfesseur);
router.post("/", auth_1.authenticate, ProfesseurController_1.ProfessController.createProfesseur);
router.put("/:id", auth_1.authenticate, ProfesseurController_1.ProfessController.updateProfesseur);
router.delete("/:id", auth_1.authenticate, ProfesseurController_1.ProfessController.deleteProfesseur);
// Routes pour la validation par l'admin
router.put("/:id/valider", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.validerProfesseur);
router.put("/:id/rejeter", auth_1.authenticate, (0, roleMiddlewares_1.roleMiddleware)([client_1.Role.ADMIN]), ProfesseurController_1.ProfessController.rejeterProfesseur);
exports.default = router;
//# sourceMappingURL=ProfesseurRoute.js.map