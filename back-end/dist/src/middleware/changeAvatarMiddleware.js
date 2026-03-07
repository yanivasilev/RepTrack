"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAvatarMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dir = path_1.default.join(process.cwd(), "public", "uploads", "avatars");
fs_1.default.mkdirSync(dir, { recursive: true });
// STORAGE AND FILE NAME
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
        if (!req.user) {
            return cb(new Error("Invalid or expired access token."), "");
        }
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${req.user.id}${ext}`);
    },
});
// VALIDATES FILE TYPE
const fileFilter = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Only .JPG, .PNG and .WEBP files are allowed."));
    }
    cb(null, true);
};
exports.changeAvatarMiddleware = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});
