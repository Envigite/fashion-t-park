import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta absoluta a la carpeta pública del frontend
const publicPath = path.resolve(__dirname, "../../../frontend/public");

export const renderIndex = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
};

export const renderCarrito = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "carrito.html"));
};

export const renderLogin = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "login.html"));
};

export const renderRegister = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "register.html"));
};

export const renderProduct = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "product.html"));
};

export const renderProfile = (_: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "profile.html"));
};
