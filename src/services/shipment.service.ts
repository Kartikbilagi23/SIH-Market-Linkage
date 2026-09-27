import prisma from "../lib/prisma";
import { ShipmentStatus } from "../generated/prisma/client";

export async function createShipment(
    orderId: string,
    farmerId: string,
    data: {
        pickupLocation: string;
        deliveryLocation: string;
        carrier?: string;
        trackingNumber: string;
        estimatedDelivery?: Date;
    }
) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.farmerId !== farmerId) {
        throw new Error(
            "You are not authorized to create shipment for this order"
        );
    }

    if (order.status === "CANCELLED") {
        throw new Error("Cannot create shipment for cancelled order");
    }

    const existingShipment = await prisma.shipment.findUnique({
        where: {
            orderId,
        },
    });

    if (existingShipment) {
        throw new Error("Shipment already exists for this order");
    }

    return prisma.shipment.create({
        data: {
            orderId,
            pickupLocation: data.pickupLocation,
            deliveryLocation: data.deliveryLocation,
            carrier: data.carrier,
            trackingNumber: data.trackingNumber,
            estimatedDelivery: data.estimatedDelivery,

            status: "CREATED",
            currentLocation: data.pickupLocation,

            trackingEvents: {
                create: {
                    status: "CREATED",
                    location: data.pickupLocation,
                    description: "Shipment created",
                },
            },
        },
        include: {
            trackingEvents: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
}
export async function getShipment(
    shipmentId: string,
    userId: string
) {
    const shipment = await prisma.shipment.findUnique({
        where: {
            id: shipmentId,
        },
        include: {
            order: true,
            trackingEvents: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!shipment) {
        throw new Error("Shipment not found");
    }

    const isBuyer =
        shipment.order.buyerId === userId;

    const isFarmer =
        shipment.order.farmerId === userId;

    if (!isBuyer && !isFarmer) {
        throw new Error(
            "You are not authorized to view this shipment"
        );
    }

    return shipment;
}
export async function addTrackingEvent(
    shipmentId: string,
    userId: string,
    data: {
        status: ShipmentStatus;
        location: string;
        description?: string;
        latitude?: number;
        longitude?: number;
    }
) {
    const shipment = await prisma.shipment.findUnique({
        where: {
            id: shipmentId,
        },
        include: {
            order: true,
        },
    });

    if (!shipment) {
        throw new Error("Shipment not found");
    }

    // For now, farmer controls logistics updates.
    if (shipment.order.farmerId !== userId) {
        throw new Error(
            "You are not authorized to update this shipment"
        );
    }

    return prisma.$transaction(async (tx) => {

        const event = await tx.trackingEvent.create({
            data: {
                shipmentId,
                status: data.status,
                location: data.location,
                description: data.description,
                latitude: data.latitude,
                longitude: data.longitude,
            },
        });

        const updatedShipment =
            await tx.shipment.update({
                where: {
                    id: shipmentId,
                },
                data: {
                    status: data.status,
                    currentLocation: data.location,
                },
            });

        return {
            shipment: updatedShipment,
            event,
        };
    });
}