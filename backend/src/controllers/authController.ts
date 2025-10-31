import type { Request, Response } from "express";
import { registerSchema, loginSchema, updateUserSchema } from "../schemas/authSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
import type { LoginBody, RegisterBody } from "../types/auth.js";
import { isProduction } from "../utils/env.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

const JWT_SECRET: string = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "30d";


// ---------------- REGISTER ----------------
export const registerUser = async (
  req: Request <{}, {}, RegisterBody>, 
  res: Response
) => {
  try {

    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: parsed.error.issues,
      });
    }

    const { username, email, password } = parsed.data;

    const existing = await UserModel.findByEmailOrUsername(email, username);

    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({ error: "El correo ya está registrado" })
      }
      if (existing.username === username) {
        return res.status(409).json({ error: "El nombre de usuario ya está en uso" })
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.createUser(
      username,
      email,
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

    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: parsed.error.issues,
      });
    }

    const { email, password } = parsed.data;

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

// ---------------- GET USER ID ----------------
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(404).json({ error: "Usuario no encontrado" });
    const user = await UserModel.getUserById(userId);
    return res.json(user);
  } catch (err) {
    console.error("Error al obtener perfil:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ---------------- UPDATE ----------------
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const parseResult = updateUserSchema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({error: "Datos inválidos", details: parseResult.error.issues})
    }

    const { username, password } = parseResult.data;

    if (!username) return res.status(400).json({ error: "El nombre de usuario es obligatorio" });

    let hashedPassword: string | undefined = undefined;
    if (password) hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserModel.updateUser(userId, username, hashedPassword);
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

    return res.json(updatedUser);
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    return res.status(500).json({ error: "Error al actualizar perfil" });
  }
};

