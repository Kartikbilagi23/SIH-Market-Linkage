import prisma from "../lib/prisma";

export async function createListing(
    farmerId: string,
    produceId: string,
    pricePerUnit: number
) {
    // 1. Check ownership
    const produce = await prisma.produce.findFirst({
        where: {
            id: produceId,
            farmerId,
        },
    });

    if (!produce) {
        throw new Error("Produce not found");
    }

    // 2. Prevent duplicate listing
    const existingListing = await prisma.listing.findUnique({
        where: {
            produceId,
        },
    });

    if (existingListing) {
        throw new Error("Listing already exists for this produce");
    }

    // 3. Create listing using produce quantity
    return prisma.listing.create({
        data: {
            produceId: produce.id,
            pricePerUnit,
            availableQuantity: produce.quantity,
        },
    });
}
export async function getActiveListings() {
    const listings = await prisma.listing.findMany({
        where: {
            status: "ACTIVE",
            availableQuantity: {
                gt: 0,
            },
        },
        include: {
            produce: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return listings;
}
export async function getListingById(listingId: string) {
    return prisma.listing.findFirst({
        where: {
            id: listingId,
            status: "ACTIVE",
            availableQuantity: {
                gt: 0,
            },
        },
        include: {
            produce: true,
        },
    });
}


