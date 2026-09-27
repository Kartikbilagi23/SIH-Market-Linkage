import { NextFunction,Response } from "express";
import { AuthRequest } from "./auth.middleware";

type Role= "FARMER" | "BUYER";

export function authorize(...allowedRoles:Role[]) {
    return (
        req:AuthRequest,
        res:Response,
        next:NextFunction
    )=>{
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"authentication required"
            })
        }
        if(!allowedRoles.includes(req.user.role as Role)){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }
        next();
    }
}