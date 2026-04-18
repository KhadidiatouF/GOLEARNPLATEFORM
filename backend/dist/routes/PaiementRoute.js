"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaiementController_1 = require("../controllers/PaiementController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, PaiementController_1.PaiementController.getAllPaiements);
router.get("/:id", auth_1.authenticate, PaiementController_1.PaiementController.getOnePaiement);
router.post("/", auth_1.authenticate, PaiementController_1.PaiementController.createPaiement);
router.post("/webhook", PaiementController_1.PaiementController.webhookConfirmation);
router.put("/:id", auth_1.authenticate, PaiementController_1.PaiementController.updatePaiement);
router.delete("/:id", auth_1.authenticate, PaiementController_1.PaiementController.deletePaiement);
exports.default = router;
//# sourceMappingURL=PaiementRoute.js.map