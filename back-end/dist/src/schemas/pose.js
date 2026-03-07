"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseSchema = void 0;
const zod_1 = require("zod");
exports.PoseSchema = zod_1.z.object({
    mimetype: zod_1.z.enum(["video/mp4", "video/quicktime", "video/webm"], "Only .MP4, .MOV and .WEBM video files are allowed."),
    size: zod_1.z.number().max(50 * 1024 * 1024, "Video file size is limited to 50 MB."),
    filename: zod_1.z.string().min(1, "Video file could not be saved correctly."),
    originalname: zod_1.z.string().min(1, "The video requires a name."),
});
