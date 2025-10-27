import { pool } from "../config/db.ts";

export const ProductModel = {
  listProductsModel: async () => {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return result.rows;
  },

  createProductModel: async (
    name: string,
    description: string | null,
    price: number,
    stock: number,
    category: string | null,
    image_url: string | null
  ) => {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stock, category, image_url]
    );

    return result.rows[0];
  },
};
