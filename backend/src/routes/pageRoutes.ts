import { Router } from "express";
import { renderIndex, renderCarrito, renderLogin, renderRegister } from "../controllers/pageController.ts";

const router = Router();

router.get("/", renderIndex);
router.get("/carrito", renderCarrito);
router.get("/login", renderLogin);
router.get("/register", renderRegister);

export default router;
