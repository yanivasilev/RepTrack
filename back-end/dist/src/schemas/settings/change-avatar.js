"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeAvatarSchema = void 0;
const zod_1 = require("zod");
exports.changeAvatarSchema = zod_1.z.object({
    mimetype: zod_1.z.enum(["image/jpeg", "image/png", "image/webp"], "Only .JPG, .PNG and .WEBP files are allowed."),
    size: zod_1.z.number().max(2 * 1024 * 1024, "File size is limited to 2 MB."), // 2MB
    filename: zod_1.z.string().min(1, "File could not be saved correctly."),
    originalname: zod_1.z.string().min(1, "The file requires a name."),
});
