import type { Request, Response, NextFunction } from "express";
import pkg from "jsonwebtoken";

const { verify } = pkg;
const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // ← Ahora leemos token desde cookie

  if (!token) {
    return res.status(401).json({ error: "No hay sesión activa" });
  }

  try {
    const decoded = verify(token, JWT_SECRET) as unknown as { id: string; role: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token expirado o inválido" });
  }
};
