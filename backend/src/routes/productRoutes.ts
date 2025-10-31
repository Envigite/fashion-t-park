import { Router } from "express";
import { listProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/productController.ts";
import { authenticateJWT } from "../middlewares/authMiddleware.ts";
import { authorizeRole } from "../middlewares/roleMiddleware.ts";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById)
router.post("/", authenticateJWT, authorizeRole(["admin"]), createProduct);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), updateProduct);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteProduct);

export default router;
