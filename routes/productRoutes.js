import { Router } from "express";
import {
  createNewProduct,
  deleteSingleProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProduct,
} from "../controllers/productControllers.js";
import { auth } from "../middlewares.js/authentication.js";
import { isAdmin } from "../middlewares.js/isAdmin.js";
const router = Router();

// routes
// GET /products/ (read all the products)
router.get("/", getAllProducts);

// GET /products/:id  (read a single product)
router.get("/:id", getSingleProduct);

// POST /products/ (add a new product)
router.post("/",auth, isAdmin, createNewProduct);

// PATCH /products/:id (update existing single product)
router.patch("/:id",auth, isAdmin, updateSingleProduct);

// DELETE /products/:id   (deleting single product)
router.delete("/:id",auth, isAdmin, deleteSingleProduct);

export default router;
