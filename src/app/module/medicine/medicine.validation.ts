// import z from "zod";


// const createMedicineZodSchema = z.object({
//     name : z.string("Name is required"),
//     price : z.number("price is required"),
//     stock: z.number("Stock is required"),
//     manufacturer:z.string("Manufacturer is required"),
//     imageURL:z.string("").optional(),
//     categoryId:z.string("")

// })

// export const medicineValidation = {
//     createMedicineZodSchema
// }

import z from "zod";

const createMedicineZodSchema = z.object({
  name: z.string().min(1, "Name is required"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  manufacturer: z.string().min(1, "Manufacturer is required"),

  imageURL: z.string().optional(),
  description:z.string().min(1,"Description is required"),

  categoryId: z.string().min(1, "Category is required"),
});

export const medicineValidation = {
  createMedicineZodSchema,
};