import { Router } from "express";
import { getWeather } from "../controllers/weatherController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getWeather);

export default router;
