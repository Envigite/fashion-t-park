import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.ts";
import { authenticateJWT } from "../middlewares/authMiddleware.ts";

const router = Router();

router.get("/", authenticateJWT, getCart);
router.post("/", authenticateJWT, addToCart);
router.put("/", authenticateJWT, updateCartItem);
router.delete("/:product_id", authenticateJWT, removeCartItem);

export default router;
