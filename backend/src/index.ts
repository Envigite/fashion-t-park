import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.ts";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import protectedRoutes from "./routes/protectedRoutes.ts";
import pageRoutes from "./routes/pageRoutes.ts";
import { authenticateJWT } from "./middlewares/authMiddleware.ts";
import { authorizeRole } from "./middlewares/roleMiddleware.ts";

const app = express();
const PORT = process.env.PORT ?? 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globales
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../../frontend/public")));
app.use("/dist", express.static(path.join(__dirname, "../../frontend/dist")));

// API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", authenticateJWT, authorizeRole(["admin"]), userRoutes);

// Rutas protegidas de interfaz
app.use("/admin", authenticateJWT, authorizeRole(["admin"]), protectedRoutes);

// Rutas públicas de interfaz
app.use("/", pageRoutes);

// 404
app.use((_, res) => {
  res.status(404).send("Página no encontrada");
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

