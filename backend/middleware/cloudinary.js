import multer from "multer";
import fs from "fs";
import cloudinary from "../config/cloudinary.js"; 
import path from "path";

const storage = multer.diskStorage({
  destination: "uploaded/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/avi", "video/mkv", "video/quicktime", "video/mov"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
}).single("videopath");

export const cloudinaryFile = async (req, res, next) => {
  try {
    if (!req.file) {
      req.body.videopath=null;
      return next();
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'videos',
      resource_type: 'video', // Key line: tells Cloudinary it's a video
    });

    req.body.videopath = result.secure_url; 

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
    });

    next(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Video upload failed', error });
  }
};

