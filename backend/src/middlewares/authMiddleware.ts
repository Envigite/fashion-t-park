import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

interface JWTPayload {
  id: string;
  role: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "No hay sesión activa" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Token expirado o inválido" });
  }
};
