import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authroute from "./routes/auth.routes";
import produceRoute from "./routes/produce.routes"
import listingRoute from "./routes/listing.routes";
import offerRoutes from "./routes/offer.routes";
import orderRoutes from "./routes/order.routes";
import shipmentRoutes from "./routes/shipment.routes";


dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authroute);

app.use("/api/produce",produceRoute);
app.use("/api/offers",offerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments",shipmentRoutes);

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Working fine dude!"
    })
})

app.use("/api/listings",listingRoute);

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})
