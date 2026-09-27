import prisma from "../lib/prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export async function registerUser(
 name:string,
 email:string,
 password:string,
 role:"FARMER" | "BUYER"
) {
    const existingUser=await prisma.user.findUnique({
        where:{email}
    });
    if(existingUser){
        throw new Error("User already exists");
    }
    const passwordHash=await bcrypt.hash(password,10);
    const user=await prisma.user.create({
        data:{
            name,
            email,
            passwordHash,
            role
        },
    });
    return {
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    }
}

export async function loginUser(
    email:string,
    password:string
) {
    const user=await prisma.user.findUnique({
        where:{email},
    })
    if(!user){
        throw new Error("Invalid email or password");
    }
    const ismatch=await bcrypt.compare(password,user.passwordHash);
    if(!ismatch){
        throw new Error("Invalid credentials");
    }
    const secret=process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET no configured");
    }
    const token=jwt.sign(
        {
            userId:user.id,
            role:user.role
        },
        secret,
        {
            expiresIn:"1d"
        }
    )
    return {
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    }
}







