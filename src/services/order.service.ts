import prisma from "../lib/prisma";

export async function getMyOrders(buyerId: string) {
    return prisma.order.findMany({
        where: {
            buyerId,
        },
        include: {
            offer: true,
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

export async function getReceivedOrders(farmerId: string) {
    return prisma.order.findMany({
        where: {
            farmerId,
        },
        include: {
            offer: true,
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