import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import { authenticateJWT } from "./middleware/authMiddleware.ts";
import { authorizeRole } from "./middleware/roleMiddleware.ts";
import userRoutes from "./routes/userRoutes.ts";
import cookieParser from "cookie-parser";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // ajusta si tu frontend vive en otra url
    credentials: true, // permite enviar cookies
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../../frontend/public")));
app.use("/dist", express.static(path.join(__dirname, "../../frontend/dist")));

// Páginas públicas
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.get("/carrito", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/carrito.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/register.html"));
});

// Ruta protegida — ahora sí bloquea usuarios no-admin
app.get("/admin", authenticateJWT, authorizeRole(["admin"]), (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/secure/admin.html"));
});

// API productos
app.get("/api/products", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows);
  } catch {
    res.status(500).send("Error al obtener productos");
  }
});

app.post(
  "/api/products",
  authenticateJWT,
  authorizeRole(["admin"]),
  async (req: Request, res: Response) => {
    try {
      const { name, description, price, stock, category, image_url } = req.body;

      if (!name || !price) return res.status(400).send("Faltan campos requeridos");

      const result = await pool.query(
        `INSERT INTO products (name, description, price, stock, category, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, description, price, stock ?? 0, category ?? null, image_url ?? null]
      );

      res.status(201).json(result.rows[0]);
    } catch {
      res.status(500).send({ error: "Error interno del servidor" });
    }
  }
);

// API usuarios protegida
app.use("/api/users", authenticateJWT, authorizeRole(["admin"]), userRoutes);

// 404
app.use((_, res) => {
  res.status(404).send("Página no encontrada");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
