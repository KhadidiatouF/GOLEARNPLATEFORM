"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionController_1 = require("../controllers/QuestionController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, QuestionController_1.QuestionController.getAllQuestions);
router.get("/:id", auth_1.authenticate, QuestionController_1.QuestionController.getOneQuestion);
router.post("/", auth_1.authenticate, QuestionController_1.QuestionController.createQuestion);
router.put("/:id", auth_1.authenticate, QuestionController_1.QuestionController.updateQuestion);
router.delete("/:id", auth_1.authenticate, QuestionController_1.QuestionController.deleteQuestion);
exports.default = router;
//# sourceMappingURL=QuestionRoute.js.map