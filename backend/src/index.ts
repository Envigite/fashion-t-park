import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import { authenticateJWT } from "./middlewares/authMiddleware.js";
import { authorizeRole } from "./middlewares/roleMiddleware.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares globales
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https:"], // Permitir imágenes externas
      },
    },
  })
);

// Redirigir accesos con .html a la ruta limpia
app.use((req, res, next) => {
  if (req.url.endsWith(".html") && !req.url.startsWith("/components/")) {
    const cleanUrl = req.url.replace(/\.html$/, "");
    return res.redirect(301, cleanUrl);
  }
  next();
});


// Archivos estáticos
const publicPath = path.resolve(__dirname, "../../frontend/public");
const distPath = path.resolve(__dirname, "../../frontend/dist");

app.use("/assets", express.static(path.join(publicPath, "assets")));
app.use("/dist", express.static(distPath));
app.use(express.static(publicPath));


// API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", authenticateJWT, authorizeRole(["admin"]), userRoutes);
app.use("/api/cart", cartRoutes);

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

