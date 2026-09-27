import { Router } from "express";
import { create } from "../controllers/listing.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { getAll,getOne } from "../controllers/listing.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("FARMER"),
    create
);

router.get(
    "/",
    authenticate,
    authorize("BUYER"),
    getAll
);
router.get(
    "/:id",
    authenticate,
    authorize("BUYER"),
    getOne
);



export default router;