import { Router } from "express";
import { listProducts, createProduct } from "../controllers/productController.ts";
import { authenticateJWT } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/roleMiddleware.ts";

const router = Router();

router.get("/", listProducts);
router.post("/", authenticateJWT, authorizeRole(["admin"]), createProduct);

export default router;
