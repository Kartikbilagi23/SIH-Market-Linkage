import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createProduce, getProduceById } from "../services/produce.service";
import { ZodError } from "zod";
import { getMyProduce } from "../services/produce.service";
import { createProduceSchema } from "../validators/produce.validator";
import { updateProduce } from "../services/produce.service";
import { deleteProduce } from "../services/produce.service";


export async function create(
    req:AuthRequest,
    res:Response
) {
    try {
        const farmerId=req.user!.userId;
        const validatedData = createProduceSchema.parse(req.body);
        const produce=await createProduce(farmerId,validatedData);
        res.status(201).json({
            success:true,
            produce
        })
    } catch (error) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
        res.status(400).json({
            success:false,
            message:error instanceof Error ? error.message : 
            "Failed to create produce"
        })
    }
}
export async function getMine(
    req: AuthRequest,
    res: Response
) {
    try {
        const produce = await getMyProduce(
            req.user!.userId
        );

        res.status(200).json({
            success: true,
            count: produce.length,
            produce,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch produce",
        });
    }
}
export async function getOne(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid produce ID"
            });
        }

        const produce = await getProduceById(
            id,
            req.user!.userId
        );

        if (!produce) {
            return res.status(404).json({
                success: false,
                message: "Produce not found"
            });
        }

        return res.status(200).json({
            success: true,
            produce
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export async function update(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const produce = await updateProduce(
            req.params.id,
            req.user!.userId,
            req.body
        );

        res.status(200).json({
            success: true,
            produce,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to update produce";

        if (message === "Produce not found") {
            return res.status(404).json({
                success: false,
                message,
            });
        }

        return res.status(400).json({
            success: false,
            message,
        });
    }
}
export async function remove(
    req: AuthRequest<{id:string}>,
    res: Response
) {
    try {
        const produce = await deleteProduce(
            req.params.id,
            req.user!.userId
        );

        return res.status(200).json({
            success: true,
            message: "Produce deleted successfully",
            produce,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete produce";

        if (message === "Produce not found") {
            return res.status(404).json({
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



