import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
    getMyOrders,
    getReceivedOrders,
} from "../services/order.service";

export async function getMine(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const orders = await getMyOrders(
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
}

export async function getReceived(
    req: AuthRequest,
    res: Response
) {
    try {
        const orders = await getReceivedOrders(
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
}