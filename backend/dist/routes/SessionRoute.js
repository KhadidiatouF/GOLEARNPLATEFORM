"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, SessionController_1.SessionController.getAllSessions);
router.get("/:id", auth_1.authenticate, SessionController_1.SessionController.getOneSession);
router.post("/", auth_1.authenticate, SessionController_1.SessionController.createSession);
router.put("/:id", auth_1.authenticate, SessionController_1.SessionController.updateSession);
router.delete("/:id", auth_1.authenticate, SessionController_1.SessionController.deleteSession);
exports.default = router;
//# sourceMappingURL=SessionRoute.js.map