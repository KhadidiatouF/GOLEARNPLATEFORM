import { Router } from "express";
import { PaiementController } from "../controllers/PaiementController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/", authenticate, PaiementController.getAllPaiements);
router.get("/:id", authenticate, PaiementController.getOnePaiement);
router.post("/", authenticate, PaiementController.createPaiement);
router.post("/webhook", PaiementController.webhookConfirmation);
router.put("/:id", authenticate, PaiementController.updatePaiement);
router.delete("/:id", authenticate, PaiementController.deletePaiement);

export default router;
