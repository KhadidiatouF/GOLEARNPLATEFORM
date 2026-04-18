"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdministrateurController_1 = require("../controllers/AdministrateurController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, AdministrateurController_1.AdministrateurController.getAllAdministrateurs);
router.get("/statistics", auth_1.authenticate, AdministrateurController_1.AdministrateurController.getStatistics);
router.get("/:id", auth_1.authenticate, AdministrateurController_1.AdministrateurController.getOneAdministrateur);
router.post("/", auth_1.authenticate, AdministrateurController_1.AdministrateurController.createAdministrateur);
router.put("/:id", auth_1.authenticate, AdministrateurController_1.AdministrateurController.updateAdministrateur);
router.delete("/:id", auth_1.authenticate, AdministrateurController_1.AdministrateurController.deleteAdministrateur);
exports.default = router;
//# sourceMappingURL=AdministrateurRoute.js.map