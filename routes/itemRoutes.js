import express from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every item route requires a logged-in user.
router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.get("/:id", protect, getItemById);
router.delete("/:id", protect, deleteItem);

export default router;
