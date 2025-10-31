import { Router } from "express";
import { renderIndex, renderCarrito, renderLogin, renderRegister, renderProduct, renderProfile } from "../controllers/pageController.js";

const router = Router();

router.get("/", renderIndex);
router.get("/carrito", renderCarrito);
router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.get("/product", renderProduct);
router.get("/profile", renderProfile);


export default router;
