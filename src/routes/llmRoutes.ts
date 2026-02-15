import { Router } from "express";
import { getSoilAdvisor, detectDisease } from "../controllers/llmController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/soil-advisor", authenticate, getSoilAdvisor);
router.post("/disease-detection", authenticate, detectDisease);

export default router;
