import { Router } from "express";
import { SessionController } from "../controllers/SessionController";

const router = Router();

router.get("/", SessionController.getAllSessions);
router.get("/:id", SessionController.getOneSession);
router.post("/", SessionController.createSession);
router.put("/:id", SessionController.updateSession);
router.delete("/:id", SessionController.deleteSession);

export default router;
