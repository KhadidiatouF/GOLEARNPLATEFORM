"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CertificationController_1 = require("../controllers/CertificationController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, CertificationController_1.CertificationController.getAllCertifications);
router.get("/:id", auth_1.authenticate, CertificationController_1.CertificationController.getOneCertification);
router.post("/", auth_1.authenticate, CertificationController_1.CertificationController.createCertification);
router.delete("/:id", auth_1.authenticate, CertificationController_1.CertificationController.deleteCertification);
exports.default = router;
//# sourceMappingURL=CertificationRoute.js.map