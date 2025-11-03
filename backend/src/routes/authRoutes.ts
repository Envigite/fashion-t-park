import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, checkUserProfile } from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", authenticateJWT, getUserProfile);
router.put("/me", authenticateJWT, updateUserProfile);
router.get("/check", authenticateJWT, checkUserProfile);

export default router;