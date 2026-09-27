import { z } from "zod";

export const createProduceSchema = z.object({
    cropName: z
        .string()
        .trim()
        .min(2, "Crop name must contain at least 2 characters"),

    quantity: z
        .number()
        .positive("Quantity must be greater than 0"),

    unit: z.enum(["KG", "QUINTAL", "TON"]),

    quality: z
        .string()
        .trim()
        .optional(),

    harvestDate: z
        .string()
        .date()
        .optional(),
});