import { Router } from "express";
import { listProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById)
router.post("/", authenticateJWT, authorizeRole(["admin"]), createProduct);
router.put("/:id", authenticateJWT, authorizeRole(["admin"]), updateProduct);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteProduct);

export default router;
