import multer, { Multer } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) callback(null, true);
  else callback(new Error("Not an image! Please upload only images."));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
