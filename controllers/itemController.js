import mongoose from "mongoose";

import Item from "../models/Item.js";

export const createItem = async (req, res, next) => {
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
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      message: "Items fetched successfully",
      count: items.length,
      items
    });
  } catch (error) {
    next(error);
  }
};

export const getItemById = async (req, res, next) => {
  try {
    // Validate the id first so Mongoose does not throw a cast error.
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
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
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
    next(error);
  }
};
