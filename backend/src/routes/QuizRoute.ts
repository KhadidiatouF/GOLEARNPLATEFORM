import { Router } from "express";
import { QuizController } from "../controllers/QuizController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, QuizController.getAllQuizzes);
router.get("/:id", authenticate, QuizController.getOneQuiz);
router.post("/", authenticate, QuizController.createQuiz);
router.put("/:id", authenticate, QuizController.updateQuiz);
router.delete("/:id", authenticate, QuizController.deleteQuiz);

// Nouvelles routes pour la logique métier des quiz
router.post("/:id/submit", authenticate, QuizController.submitQuiz);
router.get("/formation/:formationId/can-take-final", authenticate, QuizController.checkCanTakeFinalQuiz);
router.get("/formation/:formationId/summary", authenticate, QuizController.getQuizSummary);
router.get("/final/:formationId", authenticate, QuizController.getFinalQuiz);

export default router;
