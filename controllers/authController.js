import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { buildUserResponse } from "../utils/buildUserResponse.js";
import setTokenCookie, { getAuthCookieOptions } from "../utils/setTokenCookie.js";
import { removeFromCloudinary, uploadToCloudinary } from "../utils/uploadToCloudinary.js";

const allowedRoles = ["student", "teacher", "admin"];

// This helper makes sure the role sent by the client is one of the allowed values.
// If something unexpected comes in, we safely fall back to a student role.
const getSafeRole = (role) => {
  return allowedRoles.includes(role) ? role : "student";
};

export const signupUser = async (req, res, next) => {
  try {
    // Read the text fields from the signup form.
    const { name, email, password, role } = req.body;

    // Basic validation so empty accounts are not created.
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Make the email lowercase and trim extra spaces so the lookup is consistent.
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    // Stop if the email is already registered.
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it to the database.
    // This keeps the password protected even if the database is ever exposed.
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the client sent an uploaded image, save its Cloudinary info to the user.
    // The file is available through req.file because the route used multer first.
    let profileImage = undefined;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file);
      profileImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      };
    }

    // Create the new database record.
    // In a real app, roles are often assigned by an admin, but this demo keeps it simple.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: getSafeRole(role),
      ...(profileImage ? { profileImage } : {})
    });

    // Log the user in for the current browser session by setting a cookie.
    setTokenCookie(res, user._id);

    res.status(201).json({
      message: "User created successfully",
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    // Read the email and password from the login form.
    const { email, password } = req.body;

    // Make sure the form is not empty before trying to log in.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize the email the same way we did during signup.
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // If there is no matching account, return a simple error.
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the submitted password with the stored hash.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Set the auth cookie so the user stays logged in in the browser.
    setTokenCookie(res, user._id);

    res.json({
      message: "Login successful",
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  // Overwrite the cookie with an expired value so the browser removes it.
  res.cookie("token", "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
    expires: new Date(0)
  });

  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
  res.json({
    message: "Authenticated user fetched successfully",
    user: buildUserResponse(req.user)
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    // Read the text fields from the update form.
    const { name, bio, role } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only update fields that were actually provided.
    if (name) {
      user.name = name.trim();
    }

    if (typeof bio === "string") {
      user.bio = bio.trim();
    }

    if (role) {
      user.role = getSafeRole(role);
    }

    // If a new file was uploaded, replace the old profile photo on Cloudinary.
    if (req.file) {
      // multer makes the uploaded file available here as req.file.
      const uploadedImage = await uploadToCloudinary(req.file);

      // Delete the old image so the user does not keep old photos in Cloudinary.
      if (user.profileImage?.publicId) {
        await removeFromCloudinary(user.profileImage.publicId);
      }

      user.profileImage = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id
      };
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: buildUserResponse(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentArea = async (req, res) => {
  res.json({
    message: "Student area loaded successfully",
    role: req.user.role,
    note: "Every logged-in user can open this route."
  });
};

export const getTeacherArea = async (req, res) => {
  res.json({
    message: "Teacher area loaded successfully",
    role: req.user.role,
    note: "Only teacher and admin roles can open this route."
  });
};

export const getAdminArea = async (req, res, next) => {
  try {
    // Passwords stay excluded even on the admin route.
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Admin area loaded successfully",
      role: req.user.role,
      count: users.length,
      users: users.map(buildUserResponse)
    });
  } catch (error) {
    next(error);
  }
};
