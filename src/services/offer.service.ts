import prisma from "../lib/prisma";
// import Prisma from "../generated/prisma/client"

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
//buyer offer create karega like bargaining with farmer 
// Listed:
// 450 KG @ ₹28/KG

// Buyer offers:
// 300 KG @ ₹26/KG

//         ↓

//        OFFER
//       PENDING
export async function createOffer(
    buyerId: string,
    listingId: string,
    offeredQuantity: number,
    offeredPrice: number,
    message?: string
) {
    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
        include: {
            produce: true,
        },
    });

    if (!listing) {
        throw new Error("Listing not found");
    }

    if (listing.status !== "ACTIVE") {
        throw new Error("Listing is not active");
    }

    if (listing.availableQuantity <= 0) {
        throw new Error("Listing is sold out");
    }

    if (offeredQuantity > listing.availableQuantity) {
        throw new Error(
            `Only ${listing.availableQuantity} ${listing.produce.unit} available`
        );
    }

    // Farmer cannot make an offer on their own listing
    if (listing.produce.farmerId === buyerId) {
        throw new Error(
            "You cannot make an offer on your own listing"
        );
    }

    return prisma.offer.create({
        data: {
            listingId,
            buyerId,
            offeredQuantity,
            offeredPrice,
            message,
        },
    });
}


// maps to the buyer dashboard/UI.
// GET /api/offers/my
// The important security rule:
// Return only offers belonging to the logged-in buyer.
// So even if Buyer B knows Buyer A's offer IDs, they shouldn't see them through this endpoint.
export async function getMyOffers(buyerId: string) {
    return prisma.offer.findMany({
        where: {
            buyerId,
        },
        include: {
            listing: {
                include: {
                    produce: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getReceivedOffers(farmerId: string) {
    return prisma.offer.findMany({
        where: {
            listing: {
                produce: {
                    farmerId,
                },
            },
        },
        include: {
            listing: {
                include: {
                    produce: true,
                },
            },
            buyer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
export async function acceptOffer(
    offerId: string,
    farmerId: string
) {
    return prisma.$transaction(async (tx: TransactionClient) => {

        const offer = await tx.offer.findUnique({
            where: {
                id: offerId,
            },
            include: {
                listing: {
                    include: {
                        produce: true,
                    },
                },
            },
        });

        if (!offer) {
            throw new Error("Offer not found");
        }

        // Only the farmer who owns the produce can accept
        if (offer.listing.produce.farmerId !== farmerId) {
            throw new Error("You are not authorized to accept this offer");
        }

        if (offer.status !== "PENDING") {
            throw new Error("Only pending offers can be accepted");
        }

        if (offer.offeredQuantity > offer.listing.availableQuantity) {
            throw new Error(
                `Only ${offer.listing.availableQuantity} ${offer.listing.produce.unit} available`
            );
        }

        // Reduce available quantity
        const updatedListing = await tx.listing.update({
            where: {
                id: offer.listingId,
            },
            data: {
                availableQuantity: {
                    decrement: offer.offeredQuantity,
                },
            },
        });

        // Mark offer accepted
        const acceptedOffer = await tx.offer.update({
            where: {
                id: offer.id,
            },
            data: {
                status: "ACCEPTED",
            },
        });
        const order = await tx.order.create({
            data: {
                offerId: offer.id,
                listingId: offer.listingId,
                buyerId: offer.buyerId,
                farmerId: offer.listing.produce.farmerId,

                quantity: offer.offeredQuantity,
                agreedPrice: offer.offeredPrice,

                totalAmount:
                    offer.offeredQuantity * offer.offeredPrice,

                status: "CONFIRMED",
            },
        });

        return {
            offer: acceptedOffer,
            listing: updatedListing,
            order
        }
    }, {
        maxWait: 10000,
        timeout: 15000
    });
}



