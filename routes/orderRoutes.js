import { Router } from "express";
import {
  createNewOrder,
  deleteSingleOrder,
  getAllOrders,
  getSingleOrder,
  updateSingleOrder,
} from "../controllers/orderControllers.js";
import { auth } from "../middlewares.js/authentication.js";
import { isAdmin } from "../middlewares.js/isAdmin.js";
const router = Router();

// routes
// GET /orders/ (read all the orders)
router.get("/", auth, isAdmin, getAllOrders);

// GET /orders/:id  (read a single order)
router.get("/:id", getSingleOrder);

// POST /orders/ (add a new order)
router.post("/", createNewOrder);

// PATCH /orders/:id (update existing single order)
router.patch("/:id",auth, isAdmin, updateSingleOrder);

// DELETE /orders/:id   (deleting single order)
router.delete("/:id",auth, isAdmin, deleteSingleOrder);

export default router;
