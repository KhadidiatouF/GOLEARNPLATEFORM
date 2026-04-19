"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuizController_1 = require("../controllers/QuizController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, QuizController_1.QuizController.getAllQuizzes);
router.post("/coach-feedback", auth_1.authenticate, QuizController_1.QuizController.getCoachFeedback);
router.get("/:id", auth_1.authenticate, QuizController_1.QuizController.getOneQuiz);
router.post("/", auth_1.authenticate, QuizController_1.QuizController.createQuiz);
router.put("/:id", auth_1.authenticate, QuizController_1.QuizController.updateQuiz);
router.delete("/:id", auth_1.authenticate, QuizController_1.QuizController.deleteQuiz);
// Nouvelles routes pour la logique métier des quiz
router.post("/:id/submit", auth_1.authenticate, QuizController_1.QuizController.submitQuiz);
router.get("/formation/:formationId/can-take-final", auth_1.authenticate, QuizController_1.QuizController.checkCanTakeFinalQuiz);
router.get("/formation/:formationId/summary", auth_1.authenticate, QuizController_1.QuizController.getQuizSummary);
router.get("/final/:formationId", auth_1.authenticate, QuizController_1.QuizController.getFinalQuiz);
exports.default = router;
//# sourceMappingURL=QuizRoute.js.map