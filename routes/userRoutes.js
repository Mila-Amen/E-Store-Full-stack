import { Router } from "express";
import {
  createNewUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  loginUser,
  verifyToken,
} from "../controllers/userControllers.js";
const router = Router();
import { validators } from "../middlewares.js/users-validators.js";
import { auth } from "../middlewares.js/authentication.js";
import { isAdmin } from "../middlewares.js/isAdmin.js";
import multer from "multer";

const multerMiddleware = multer()
// routes
// GET /users/ (read all the users)
router.get("/", auth, isAdmin, getAllUsers);

//Get verify token (verify token)

router.get("/verifytoken", verifyToken);

// GET /users/:id  (read a single user)
router.get("/:id", auth, isAdmin, getSingleUser);

// POST /users/ (add a new user)
// 2 types of middlewares (external and custom middlewares )

//validating the data email and password
router.post("/", multerMiddleware.single("profile_image"),validators, createNewUser);

// user login
router.post("/login", loginUser);
// PATCH /users/:id (update existing single user)
router.patch("/:id", auth, isAdmin, updateSingleUser);

// DELETE /users/:id   (deleting single user)
router.delete("/:id", auth, isAdmin, deleteSingleUser);

export default router;
