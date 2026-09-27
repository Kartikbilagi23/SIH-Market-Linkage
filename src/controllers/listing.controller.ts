import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createListing,getActiveListings,getListingById } from "../services/listing.service";


export async function create(
    req: AuthRequest,
    res: Response
) {
    try {
        const { produceId, pricePerUnit } = req.body;

        const listing = await createListing(
            req.user!.userId,
            produceId,
            pricePerUnit
        );

        return res.status(201).json({
            success: true,
            listing,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to create listing";

        if (
            message === "Produce not found" ||
            message === "Listing already exists for this produce"
        ) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        return res.status(500).json({
            success: false,
            message,
        });
    }
}

export async function getAll(
    req: AuthRequest,
    res: Response
) {
    try {
        const listings = await getActiveListings();

        return res.status(200).json({
            success: true,
            count: listings.length,
            listings,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch listings",
        });
    }
}

export async function getOne(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const listing = await getListingById(
            req.params.id
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        return res.status(200).json({
            success: true,
            listing,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch listing",
        });
    }
}