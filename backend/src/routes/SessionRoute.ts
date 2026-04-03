import { Router } from "express";
import { SessionController } from "../controllers/SessionController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, SessionController.getAllSessions);
router.get("/:id", authenticate, SessionController.getOneSession);
router.post("/", authenticate, SessionController.createSession);
router.put("/:id", authenticate, SessionController.updateSession);
router.delete("/:id", authenticate, SessionController.deleteSession);

export default router;
