import { Router } from "express";
import { getSchemes, createScheme, updateScheme, deleteScheme } from "../controllers/schemeController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getSchemes);
router.post("/", authenticate, authorizeAdmin, createScheme);
router.put("/:id", authenticate, authorizeAdmin, updateScheme);
router.delete("/:id", authenticate, authorizeAdmin, deleteScheme);

export default router;
