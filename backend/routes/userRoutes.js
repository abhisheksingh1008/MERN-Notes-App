import express from "express";

import {
  getUsers,
  login,
  signup,
  getUserById,
  validatePassword,
  updateUser,
  deleteUser,
} from "../controllers/user-controllers.js";
import { requireSignIn, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users", requireSignIn, admin, getUsers);
router.post("/user/login", login);
router.post("/user/signup", signup);
router.get("/user/:userId", requireSignIn, getUserById);
router.patch("/user/:userId", requireSignIn, updateUser);
router.delete("/user/:userId", requireSignIn, deleteUser);
router.get("/user", validatePassword);

export default router;
