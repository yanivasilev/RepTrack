"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePushupVideo = analyzePushupVideo;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const extractFrames_1 = require("../utils/extractFrames");
const poseService_1 = require("../services/poseService");
const pushupCounter_1 = require("../libs/pushupCounter");
const perf_hooks_1 = require("perf_hooks");
const pose_1 = require("../schemas/pose");
function normalizeFrameTimes(frames, fps) {
    if (!frames.length)
        return frames;
    // If t is missing or not a number, rebuild from index
    if (typeof frames[0].t !== "number") {
        return frames.map((f, i) => ({ ...f, t: i / fps }));
    }
    const ts = frames.map((f) => f.t).filter((x) => typeof x === "number");
    const maxT = Math.max(...ts);
    // If maxT is huge it's probably milliseconds
    if (maxT > 1000) {
        return frames.map((f) => ({ ...f, t: f.t / 1000 }));
    }
    // If it looks like frame indices (0..N)
    if (maxT > 10 && maxT <= frames.length + 5) {
        return frames.map((f, i) => ({ ...f, t: i / fps }));
    }
    // Otherwise assume already seconds
    return frames;
}
async function analyzePushupVideo(req, res) {
    const t0 = perf_hooks_1.performance.now();
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ message: "Missing video file." });
        const parsed = pose_1.PoseSchema.safeParse(file);
        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.issues.map((i) => ({
                    field: i.path.join("."),
                    message: i.message,
                })),
            });
        }
        const jobId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const framesDir = path_1.default.join("tmp", "frames", jobId);
        const fps = 30;
        const t1 = perf_hooks_1.performance.now();
        const framePaths = await (0, extractFrames_1.extractFrames)(file.path, framesDir, fps);
        const t2 = perf_hooks_1.performance.now();
        const framesRaw = await (0, poseService_1.estimatePoseOnFrames)(framePaths, fps);
        const frames = normalizeFrameTimes(framesRaw, fps);
        const t3 = perf_hooks_1.performance.now();
        // Optional: quick sanity log (remove later)
        // console.log("t0,t1,tLast,dt", frames[0]?.t, frames[1]?.t, frames[frames.length - 1]?.t, frames[1]?.t - frames[0]?.t);
        const result = (0, pushupCounter_1.countPushups)(frames);
        const t4 = perf_hooks_1.performance.now();
        await promises_1.default.rm(framesDir, { recursive: true, force: true });
        await promises_1.default.rm(file.path, { force: true });
        const t5 = perf_hooks_1.performance.now();
        return res.json({
            fps,
            frameCount: frames.length,
            ...result,
            timingsMs: {
                extractFrames: Math.round(t2 - t1),
                pose: Math.round(t3 - t2),
                count: Math.round(t4 - t3),
                cleanup: Math.round(t5 - t4),
                total: Math.round(t5 - t0),
            },
        });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: e?.message ?? "Pose analysis failed." });
    }
}
