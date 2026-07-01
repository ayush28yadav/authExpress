export const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.bio || "",
  profileImage: user.profileImage?.url || "",
  createdAt: user.createdAt
});
