import { Router } from "express";
import { ReponseController } from "../controllers/ReponseController";

const router = Router();

router.get("/", ReponseController.getAllReponses);
router.get("/:id", ReponseController.getOneReponse);
router.post("/", ReponseController.createReponse);
router.put("/:id", ReponseController.updateReponse);
router.delete("/:id", ReponseController.deleteReponse);

export default router;
