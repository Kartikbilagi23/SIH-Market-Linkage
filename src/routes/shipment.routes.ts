import { Router } from "express";

import {
    create,
    getOne,
    addEvent,
} from "../controllers/shipment.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("FARMER"),
    create
);

router.get(
    "/:id",
    authenticate,
    getOne
);

router.post(
    "/:id/events",
    authenticate,
    authorize("FARMER"),
    addEvent
);

export default router;