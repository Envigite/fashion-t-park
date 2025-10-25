import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

// Promover usuario a admin
export const promoteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID de usuario requerido" });

    const result = await pool.query(
      "UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id, username, email, role, created_at",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json({ message: "Usuario promovido a admin", user: result.rows[0] });
  } catch (err) {
    console.error("Error al promover usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const demoteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET role = 'user' WHERE id = $1 RETURNING id, username, email, role",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario degradado a user", user: result.rows[0] });
  } catch (err) {
    console.error("Error al degradar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY created_at ASC"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
