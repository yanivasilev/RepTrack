import multer from "multer";
import path from "path";
import fs from "fs";

const dir = path.join(process.cwd(), "public", "uploads", "avatars");
fs.mkdirSync(dir, { recursive: true });

// STORAGE AND FILE NAME
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),

    filename: (req, file, cb) => {
        if (!req.user) {
            return cb(new Error("Invalid or expired access token."), "");
        }

        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${req.user.id}${ext}`);
    },
});

// VALIDATES FILE TYPE
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only .JPG, .PNG and .WEBP files are allowed."));
    }

    cb(null, true);
};

export const changeAvatarMiddleware = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});