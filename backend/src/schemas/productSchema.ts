import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .min(1, { message: "El nombre no puede estar vacío" }),

  description: z.string().optional(),

  price: z.coerce
    .number({ error: "El precio debe ser un número" })
    .positive({ message: "El precio debe ser mayor a 0" }),

  stock: z.coerce
    .number({ error: "El stock debe ser un número" })
    .int({ message: "El stock debe ser entero" })
    .nonnegative({ message: "El stock no puede ser negativo" })
    .default(0),

  category: z.string().optional(),

  image_url: z
    .url({ message: "Debe ser una URL válida" })
    .optional()
    .nullable(),
});
