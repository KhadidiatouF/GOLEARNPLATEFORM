import { Router } from "express";
import { ReponseController } from "../controllers/ReponseController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, ReponseController.getAllReponses);
router.get("/:id", authenticate, ReponseController.getOneReponse);
router.post("/", authenticate, ReponseController.createReponse);
router.put("/:id", authenticate, ReponseController.updateReponse);
router.delete("/:id", authenticate, ReponseController.deleteReponse);

export default router;
