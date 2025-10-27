import type { Request, Response } from "express";
import { ProductModel } from "../models/productModel.ts";

export const listProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductModel.listProductsModel();
    return res.status(200).json(products);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;

    if (!name || !price)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    const product = await ProductModel.createProductModel(
      name,
      description ?? null,
      Number(price),
      stock ?? 0,
      category ?? null,
      image_url ?? null
    );

    return res.status(201).json(product);

  } catch (err) {
    console.error("Error al crear producto:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
