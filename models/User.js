import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic account fields.
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    },
    bio: {
      type: String,
      default: "",
      trim: true
    },
    // Store both the public image URL and Cloudinary id for easier updates.
    profileImage: {
      url: {
        type: String,
        default: ""
      },
      publicId: {
        type: String,
        default: ""
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
