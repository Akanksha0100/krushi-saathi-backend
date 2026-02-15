import { Router } from "express";
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAuditLogs,
  getAllListings,
} from "../controllers/adminController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);
router.get("/logs", getAuditLogs);
router.get("/listings", getAllListings);

export default router;
