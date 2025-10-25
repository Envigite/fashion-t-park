import { Router } from "express";
import { promoteUser, demoteUser, deleteUser, listUsers  } from "../controllers/userController.ts";
import { authenticateJWT } from "../middleware/authMiddleware.ts";
import { authorizeRole } from "../middleware/roleMiddleware.ts";

const router = Router();

// Solo un admin puede promover a otro usuario
router.put("/promote/:id", authenticateJWT, authorizeRole(["admin"]), promoteUser);
router.put("/demote/:id", authenticateJWT, authorizeRole(["admin"]), demoteUser);
router.delete("/:id", authenticateJWT, authorizeRole(["admin"]), deleteUser);
router.get("/", authenticateJWT, authorizeRole(["admin"]), listUsers);

export default router;
