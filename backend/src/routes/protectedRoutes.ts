import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/admin/admin.html"));
});

router.get("/edit", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/admin/edit.html"));
});

export default router;
