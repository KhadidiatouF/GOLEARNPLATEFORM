import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, QuestionController.getAllQuestions);
router.get("/:id", authenticate, QuestionController.getOneQuestion);
router.post("/", authenticate, QuestionController.createQuestion);
router.put("/:id", authenticate, QuestionController.updateQuestion);
router.delete("/:id", authenticate, QuestionController.deleteQuestion);

export default router;
