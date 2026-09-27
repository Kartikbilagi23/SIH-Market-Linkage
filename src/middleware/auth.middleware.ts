import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

interface JWTPayload {
    userId:string,
    role:"FARMER" | "BUYER";
}

export interface AuthRequest<
    P = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        userId: string;
        role: string;
    };
}
export function authenticate(
    req:AuthRequest,
    res:Response,
    next:NextFunction
){
    try {
        const authheader=req.headers.authorization;
        if(!authheader|| !authheader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authentication required"
            })
        }
        const token=authheader.split(" ")[1];
        const secret=process.env.JWT_SECRET;
        if(!secret){
            return res.status(500).json({
                success:false,
                message:"JWT_SECRET is not configured"
            })
        }
        const decoded=jwt.verify(token,secret) as JWTPayload;
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })
    }
}





