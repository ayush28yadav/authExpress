import express from "express";
import mongoose from "mongoose";

import Item from "../models/Item.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const item = await Item.create({
      title,
      description,
      user: req.user._id
    });

    res.status(201).json({
      message: "Item added successfully",
      item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      message: "Items fetched successfully",
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item fetched successfully",
      item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      message: "Item deleted successfully",
      item
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
