import jwt from "jsonwebtoken";

// Use the same cookie settings when setting and clearing the auth cookie.
export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

const setTokenCookie = (res, userId) => {
  // The token stores only the user id. The full user is loaded from MongoDB later.
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.cookie("token", token, getAuthCookieOptions());
};

export default setTokenCookie;
