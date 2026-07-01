import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Allow the frontend to send cookie-based requests to this API.
app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);

// Parse JSON bodies, form bodies, and cookies from incoming requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "JWT auth API with profile upload and role-based access is running",
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      logout: "POST /api/auth/logout",
      profile: "GET /api/auth/me",
      updateProfile: "PUT /api/auth/profile",
      studentArea: "GET /api/auth/student-area",
      teacherArea: "GET /api/auth/teacher-area",
      adminArea: "GET /api/auth/admin-area",
      addItem: "POST /api/items",
      findItems: "GET /api/items",
      deleteItem: "DELETE /api/items/:id"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Return upload errors in a consistent format.
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }

  return next(error);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    message: error.message || "Something went wrong on the server"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB before accepting requests.
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
