import type { Request, Response } from "express";
import { productSchema } from "../schemas/productSchema.ts";
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
    //Zod
    const parseResult = productSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        error: "Datos invalidos",
        details: parseResult.error.issues,
      })
    }

    const data = parseResult.data;

    const product = await ProductModel.createProductModel(data);

    return res.status(201).json(product);

  } catch (err) {
    console.error("Error al crear producto:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
