import "dotenv/config";
import express from 'express';
import type { Request, Response } from 'express'; // ⚡ type-only import
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./config/db.ts";

const app = express();
const PORT = 3000;
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.use("/dist", express.static(path.join(__dirname, "../../frontend/dist")));

app.get('/carrito', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/public/carrito.html"));
});

app.get("/api/products", async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener productos");
  }
});

app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const { name, price, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).send("Faltan campor requeridos");
    }

    const result = await pool.query(
      "INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *",
      [name, price, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el producto", error);
    res.status(500).send({error: "Error interno del servidor"});
  }
})

app.use((req, res) => {
    res.status(404).send('Página no encontrada');
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

