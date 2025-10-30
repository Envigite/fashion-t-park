import { pool } from "../config/db.ts";

export const ProductModel = {
  listProductsModel: async () => {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return result.rows;
  },

  createProductModel: async (data: {
    name: string;
    description?: string | null | undefined;
    price: number;
    stock?: number;
    category?: string | null | undefined;
    image_url?: string | null | undefined;
  }) => {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.name,
        data.description ?? null,
        data.price,
        data.stock ?? 0,
        data.category ?? null,
        data.image_url ?? null
      ]
    );

    return result.rows[0];
  },

  getProductByIdModel: async (id: string) => {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0] ?? null;
  }
};
