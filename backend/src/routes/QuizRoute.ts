import { Router } from "express";
import { QuizController } from "../controllers/QuizController";

const router = Router();

router.get("/", QuizController.getAllQuizzes);
router.get("/:id", QuizController.getOneQuiz);
router.post("/", QuizController.createQuiz);
router.put("/:id", QuizController.updateQuiz);
router.delete("/:id", QuizController.deleteQuiz);

// Nouvelles routes pour la logique métier des quiz
router.post("/:id/submit", QuizController.submitQuiz);
router.get("/formation/:formationId/can-take-final", QuizController.checkCanTakeFinalQuiz);
router.get("/formation/:formationId/summary", QuizController.getQuizSummary);

export default router;
