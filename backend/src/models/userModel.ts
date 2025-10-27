import { pool } from "../config/db.ts";

export const UserModel = {
  findByEmailOrUsername: async (email: string, username: string) => {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    return result.rows[0] ?? null;
  },

  createUser: async (username: string, email: string, passwordHash: string) => {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash]
    );
    return result.rows[0];
  },

  findByEmail: async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] ?? null;
  },

  promoteUserModel: async (id: string) => {
    const result = await pool.query(
      `UPDATE users 
       SET role = 'admin' 
       WHERE id = $1 
       RETURNING id, username, email, role, created_at`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  demoteUserModel: async (id: string) => {
    const result = await pool.query(
      `UPDATE users 
      SET role = 'user' 
      WHERE id = $1
      RETURNING id, username, email, role, created_at`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  deleteUserModel: async (id: string) => {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  listUsersModel: async () => {
  const result = await pool.query(
      `SELECT id, username, email, role, created_at 
      FROM users 
      ORDER BY created_at ASC`
    );
    return result.rows;
  },

};
