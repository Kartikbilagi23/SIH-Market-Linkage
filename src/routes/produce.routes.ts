import { Router } from "express";
import {create,getMine, getOne} from "../controllers/produce.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { update,remove } from "../controllers/produce.controller";

const router=Router();

router.post(
    "/",
    authenticate,
    authorize("FARMER"),
    create
);

router.get("/my",
    authenticate,
    authorize("FARMER"),
    getMine
)


router.get(
    "/:id",
    authenticate,
    authorize("FARMER"),
    getOne
)

router.patch(
    "/:id",
    authenticate,
    authorize("FARMER"),
    update
);

router.delete(
    "/:id",
    authenticate,
    authorize("FARMER"),
    remove
);


export default router;
