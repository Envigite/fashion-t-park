import type { Request, Response } from "express";
import { pool } from "../config/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.ts";
import type { LoginBody, RegisterBody } from "../types/auth.ts";
import { isProduction } from "../utils/env.ts";

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "30d";


// ---------------- REGISTRO ----------------
export const registerUser = async (
  req: Request <{}, {}, RegisterBody>, 
  res: Response
) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existing = await UserModel.findByEmailOrUsername(
      normalizedEmail, normalizedUsername
    );

    if (existing) return res.status(409).json({ error: "El usuario o email ya existen" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.createUser(
      normalizedUsername,
      normalizedEmail,
      passwordHash
    );

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 días
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
export const loginUser = async (
  req: Request<{}, {}, LoginBody>, 
  res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña son requeridos" });

    const user = await UserModel.findByEmail(email);

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
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 días
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

  res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
    });

  return res.status(200).json({ message: "Sesión cerrada" });
};
