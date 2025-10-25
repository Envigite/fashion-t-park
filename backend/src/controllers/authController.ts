import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "15m";


// ---------------- REGISTRO ----------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length > 0)
      return res.status(400).json({ error: "El usuario o email ya existen" });

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, hash]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Establecer cookie segura httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Cambiar a true cuando esté en HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña son requeridos" });

    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userQuery.rows[0];

    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // En producción: true
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ---------------- LOGOUT ----------------
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Sesión cerrada" });
};
