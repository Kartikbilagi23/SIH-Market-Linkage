import { Router } from "express";
import {register,login,getMe} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";


const router=Router();

router.post("/register",register)
router.post("/login",login);
router.get("/me",authenticate,getMe);
router.get("/farmer-test",authenticate,authorize("FARMER"),(req,res)=>{
    res.json({
        success:true,
        message:"Farmer access granted"
    })
})

export default router;