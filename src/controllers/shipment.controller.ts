import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import {
    createShipment,
    getShipment,
    addTrackingEvent,
} from "../services/shipment.service";

export async function create(
    req: AuthRequest,
    res: Response
) {
    try {
        const shipment = await createShipment(
            req.body.orderId,
            req.user!.userId,
            {
                pickupLocation: req.body.pickupLocation,
                deliveryLocation: req.body.deliveryLocation,
                carrier: req.body.carrier,
                trackingNumber: req.body.trackingNumber,
                estimatedDelivery:
                    req.body.estimatedDelivery
                        ? new Date(req.body.estimatedDelivery)
                        : undefined,
            }
        );

        return res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            shipment,
        });

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to create shipment";

        const knownErrors = [
            "Order not found",
            "You are not authorized to create shipment for this order",
            "Cannot create shipment for cancelled order",
            "Shipment already exists for this order",
        ];

        if (knownErrors.includes(message)) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create shipment",
        });
    }
}
export async function getOne(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const shipment = await getShipment(
            req.params.id,
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            shipment,
        });

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to fetch shipment";

        if (
            message === "Shipment not found" ||
            message ===
                "You are not authorized to view this shipment"
        ) {
            return res.status(404).json({
                success: false,
                message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch shipment",
        });
    }
}
export async function addEvent(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const result = await addTrackingEvent(
            req.params.id,
            req.user!.userId,
            req.body
        );

        return res.status(201).json({
            success: true,
            message: "Tracking event added successfully",
            ...result,
        });

    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to add tracking event";

        if (
            message === "Shipment not found" ||
            message ===
                "You are not authorized to update this shipment"
        ) {
            return res.status(404).json({
                success: false,
                message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to add tracking event",
        });
    }
}