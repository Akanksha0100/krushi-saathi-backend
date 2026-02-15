import { Router } from "express";
import {
  getListings,
  createListing,
  deleteListing,
} from "../controllers/marketplaceController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/listings", authenticate, getListings);
router.post("/listings", authenticate, createListing);
router.delete("/listings/:id", authenticate, deleteListing);

export default router;
