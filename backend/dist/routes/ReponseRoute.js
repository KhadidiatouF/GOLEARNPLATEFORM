"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReponseController_1 = require("../controllers/ReponseController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, ReponseController_1.ReponseController.getAllReponses);
router.get("/:id", auth_1.authenticate, ReponseController_1.ReponseController.getOneReponse);
router.post("/", auth_1.authenticate, ReponseController_1.ReponseController.createReponse);
router.put("/:id", auth_1.authenticate, ReponseController_1.ReponseController.updateReponse);
router.delete("/:id", auth_1.authenticate, ReponseController_1.ReponseController.deleteReponse);
exports.default = router;
//# sourceMappingURL=ReponseRoute.js.map