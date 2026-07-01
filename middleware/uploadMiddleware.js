import multer from "multer";

// Multer is the package that helps Express read uploaded files from a form.
// We store the file in memory first because we want to send it to Cloudinary
// right away instead of saving it to the server disk.
const storage = multer.memoryStorage();

// This function checks each uploaded file before it is accepted.
// If the file is not an image, we reject it with a clear error message.
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"));
  }

  // Accept the file and continue the request.
  cb(null, true);
};

// Create one reusable upload setup that can be used by multiple routes.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Keep uploads small so the app stays fast and does not use too much memory.
    fileSize: 2 * 1024 * 1024
  }
});

export default upload;
