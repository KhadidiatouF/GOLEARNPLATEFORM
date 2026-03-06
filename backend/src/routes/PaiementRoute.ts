import { Router } from "express";
import { PaiementController } from "../controllers/PaiementController";

const router = Router();

router.get("/", PaiementController.getAllPaiements);
router.get("/:id", PaiementController.getOnePaiement);
router.post("/", PaiementController.createPaiement);
router.put("/:id", PaiementController.updatePaiement);
router.delete("/:id", PaiementController.deletePaiement);

export default router;
