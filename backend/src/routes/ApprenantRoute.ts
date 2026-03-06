import { Router } from "express";
import { ApprenantController } from "../controllers/ApprenantController";

const router = Router();


router.get("/", ApprenantController.getAllApprenants)
router.get("/:id", ApprenantController.getOneApprenant)
router.post("/", ApprenantController.createApprenant)
router.put("/:id", ApprenantController.updateApprenant)
router.delete("/:id", ApprenantController.deleteApprenant)

export default router
