import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});

// Shipment
// currentLocation = Pune
// status = IN_TRANSIT
// (SHIPPMENT TABLE)

// TrackingEvents
// ────────────────────────────────
// 09:00  PICKED_UP       Nashik
// 13:30  AT_HUB          Nashik Hub
// 18:20  IN_TRANSIT      Mumbai
// 09:00  AT_HUB          Mumbai Hub
// ...

// (TRACKING TABLE)

// dono alag rakhna padega schema mein
