import { Router } from "express";
import { create,getMine,getReceived,accept } from "../controllers/offer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("BUYER"),
    create
);

router.get(
    "/my",
    authenticate,
    authorize("BUYER"),
    getMine
);
router.get(
    "/received",
    authenticate,
    authorize("FARMER"),
    getReceived
);

router.patch(
    "/:id/accept",
    authenticate,
    authorize("FARMER"),
    accept
);


export default router;



// {
//     "success": true,
//     "count": 2,
//     "offers": [
//         {
//             "id": "cmuihzom60001akvdfhk3k9og",
//             "listingId": "cmuhax1k20000d8vdhrxi0uml",
//             "buyerId": "cmuhq5n0r0000i4vdydbluggc",
//             "offeredQuantity": 300,
//             "offeredPrice": 26,
//             "status": "PENDING",
//             "message": "Can pick up within 2 days",
//             "createdAt": "2026-09-26T14:41:29.694Z",
//             "updatedAt": "2026-09-26T14:41:29.694Z",
//             "listing": {
//                 "id": "cmuhax1k20000d8vdhrxi0uml",
//                 "produceId": "cmuggdbb60000a8vdmww3a2a5",
//                 "pricePerUnit": 28,
//                 "availableQuantity": 450,
//                 "status": "ACTIVE",
//                 "createdAt": "2026-09-25T18:35:43.010Z",
//                 "updatedAt": "2026-09-25T18:35:43.010Z",
//                 "produce": {
//                     "id": "cmuggdbb60000a8vdmww3a2a5",
//                     "farmerId": "cmuecz6jx0000jgvdz8wog8pf",
//                     "cropName": "Tomato",
//                     "quantity": 450,
//                     "unit": "KG",
//                     "quality": "Grade A+",
//                     "harvestDate": "2026-09-20T00:00:00.000Z",
//                     "createdAt": "2026-09-25T04:20:34.051Z",
//                     "updatedAt": "2026-09-25T18:03:45.384Z"
//                 }
//             },
//             "buyer": {
//                 "id": "cmuhq5n0r0000i4vdydbluggc",
//                 "name": "Karan",
//                 "email": "buyer@test.com"
//             }
//         },
//         {
//             "id": "cmuihtlze0000akvdk8p87apu",
//             "listingId": "cmuhax1k20000d8vdhrxi0uml",
//             "buyerId": "cmuhq5n0r0000i4vdydbluggc",
//             "offeredQuantity": 300,
//             "offeredPrice": 26,
//             "status": "PENDING",
//             "message": "Can pick up within 2 days",
//             "createdAt": "2026-09-26T14:36:46.347Z",
//             "updatedAt": "2026-09-26T14:36:46.347Z",
//             "listing": {
//                 "id": "cmuhax1k20000d8vdhrxi0uml",
//                 "produceId": "cmuggdbb60000a8vdmww3a2a5",
//                 "pricePerUnit": 28,
//                 "availableQuantity": 450,
//                 "status": "ACTIVE",
//                 "createdAt": "2026-09-25T18:35:43.010Z",
//                 "updatedAt": "2026-09-25T18:35:43.010Z",
//                 "produce": {
//                     "id": "cmuggdbb60000a8vdmww3a2a5",
//                     "farmerId": "cmuecz6jx0000jgvdz8wog8pf",
//                     "cropName": "Tomato",
//                     "quantity": 450,
//                     "unit": "KG",
//                     "quality": "Grade A+",
//                     "harvestDate": "2026-09-20T00:00:00.000Z",
//                     "createdAt": "2026-09-25T04:20:34.051Z",
//                     "updatedAt": "2026-09-25T18:03:45.384Z"
//                 }
//             },
//             "buyer": {
//                 "id": "cmuhq5n0r0000i4vdydbluggc",
//                 "name": "Karan",
//                 "email": "buyer@test.com"
//             }
//         }
//     ]
// }