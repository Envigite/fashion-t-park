import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderIndex = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/index.html"));
};

export const renderCarrito = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/carrito.html"));
};

export const renderLogin = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/login.html"));
};

export const renderRegister = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/register.html"));
};

export const renderProduct = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/product.html"));
};

export const renderProfile = (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/public/profile.html"));
};
