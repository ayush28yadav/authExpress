import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "JWT auth API is running",
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      logout: "POST /api/auth/logout",
      profile: "GET /api/auth/me",
      addItem: "POST /api/items",
      findItems: "GET /api/items",
      deleteItem: "DELETE /api/items/:id"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
