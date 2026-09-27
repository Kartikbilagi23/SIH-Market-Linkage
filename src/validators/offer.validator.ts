import { z } from "zod";

export const createOfferSchema = z.object({
    listingId: z
        .string()
        .min(1, "Listing ID is required"),

    offeredQuantity: z
        .number()
        .positive("Offered quantity must be greater than 0"),

    offeredPrice: z
        .number()
        .positive("Offered price must be greater than 0"),

    message: z
        .string()
        .max(500, "Message cannot exceed 500 characters")
        .optional(),
});