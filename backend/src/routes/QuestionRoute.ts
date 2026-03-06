import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";

const router = Router();

router.get("/", QuestionController.getAllQuestions);
router.get("/:id", QuestionController.getOneQuestion);
router.post("/", QuestionController.createQuestion);
router.put("/:id", QuestionController.updateQuestion);
router.delete("/:id", QuestionController.deleteQuestion);

export default router;
