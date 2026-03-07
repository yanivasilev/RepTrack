"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFrames = extractFrames;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const promises_1 = __importDefault(require("fs/promises"));
async function extractFrames(videoPath, framesDir, fps) {
    if (!ffmpeg_static_1.default)
        throw new Error("ffmpeg-static binary not found");
    await promises_1.default.mkdir(framesDir, { recursive: true });
    const outputPattern = path_1.default.join(framesDir, "frame_%06d.jpg");
    const args = [
        "-i", videoPath,
        "-vf", `fps=${fps},scale=640:-1`,
        "-q:v", "3",
        outputPattern,
    ];
    await new Promise((resolve, reject) => {
        const p = (0, child_process_1.spawn)(ffmpeg_static_1.default, args);
        p.on("error", reject);
        p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
    });
    const files = (await promises_1.default.readdir(framesDir))
        .filter((f) => f.endsWith(".jpg"))
        .sort();
    if (files.length === 0)
        throw new Error("No frames extracted from video");
    return files.map((f) => path_1.default.join(framesDir, f));
}
