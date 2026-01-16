import { PrismaClient } from "@prisma/client";
import { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import couponRoutes from "./routes/couponRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import superAdminProductRoutes from "./routes/superAdminProductRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/super-admin/coupons", couponRoutes);
app.use("/api/super-admin/products", superAdminProductRoutes);
app.use("/api/settings", superAdminProductRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

export const primsa = new PrismaClient();
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await primsa.$disconnect();
  process.exit();
});
