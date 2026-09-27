import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createOffer,getMyOffers,getReceivedOffers,acceptOffer } from "../services/offer.service";

export async function create(
    req: AuthRequest,
    res: Response
) {
    try {
        const {
            listingId,
            offeredQuantity,
            offeredPrice,
            message,
        } = req.body;

        const offer = await createOffer(
            req.user!.userId,
            listingId,
            offeredQuantity,
            offeredPrice,
            message
        );

        return res.status(201).json({
            success: true,
            offer,
        });

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to create offer";

        const clientErrors = [
            "Listing not found",
            "Listing is not active",
            "Listing is sold out",
            "You cannot make an offer on your own listing",
        ];

        if (
            clientErrors.includes(message) ||
            message.startsWith("Only ")
        ) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create offer",
        });
    }
}
export async function getMine(
    req: AuthRequest,
    res: Response
) {
    try {
        const offers = await getMyOffers(
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            count: offers.length,
            offers,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch offers",
        });
    }
}
export async function getReceived(
    req: AuthRequest,
    res: Response
) {
    try {
        const offers = await getReceivedOffers(
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            count: offers.length,
            offers,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch received offers",
        });
    }
}
export async function accept(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const result = await acceptOffer(
            req.params.id,
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            message: "Offer accepted successfully",
            ...result,
        });

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to accept offer";

        const clientErrors = [
            "Offer not found",
            "You are not authorized to accept this offer",
            "Only pending offers can be accepted",
        ];

        if (
            clientErrors.includes(message) ||
            message.startsWith("Only ")
        ) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to accept offer",
        });
    }
}