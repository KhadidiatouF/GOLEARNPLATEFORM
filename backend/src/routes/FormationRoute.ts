import { Router } from "express";
import { FormationController } from "../controllers/FormationController";

const router = Router();

router.get("/", FormationController.getAllFormations);
router.get("/:id", FormationController.getOneFormation);
router.post("/", FormationController.createFormation);
router.post("/complete", FormationController.createCompleteFormation);
router.put("/:id", FormationController.updateFormation);
router.delete("/:id", FormationController.deleteFormation);

export default router;
