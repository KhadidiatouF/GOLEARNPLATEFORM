import { Router } from "express";
import { QuizController } from "../controllers/QuizController";

const router = Router();

router.get("/", QuizController.getAllQuizzes);
router.get("/:id", QuizController.getOneQuiz);
router.post("/", QuizController.createQuiz);
router.put("/:id", QuizController.updateQuiz);
router.delete("/:id", QuizController.deleteQuiz);

export default router;
