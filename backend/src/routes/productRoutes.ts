import { Router } from "express";
import { listProducts, createProduct, getProductById } from "../controllers/productController.ts";
import { authenticateJWT } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/roleMiddleware.ts";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById)
router.post("/", authenticateJWT, authorizeRole(["admin"]), createProduct);

export default router;
