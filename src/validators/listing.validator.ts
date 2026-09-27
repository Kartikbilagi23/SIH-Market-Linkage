import { z } from "zod";

export const createListingSchema = z.object({
    produceId: z
        .string()
        .min(1, "Produce ID is required"),

    pricePerUnit: z
        .number()
        .positive("Price must be greater than 0"),
});