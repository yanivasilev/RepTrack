import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { extractFrames } from "../utils/extractFrames";
import { estimatePoseOnFrames } from "../services/poseService";
import { countPushups } from "../libs/pushupCounter";
import { performance } from "perf_hooks";
import { PoseSchema } from "../schemas/pose";

function normalizeFrameTimes(frames: any[], fps: number) {
    if (!frames.length) return frames;

    // If t is missing or not a number, rebuild from index
    if (typeof frames[0].t !== "number") {
        return frames.map((f, i) => ({ ...f, t: i / fps }));
    }

    const ts = frames.map((f) => f.t).filter((x: any) => typeof x === "number");
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

export async function analyzePushupVideo(req: Request, res: Response) {
    const t0 = performance.now();

    try {
        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: "Missing video file." });

        const parsed = PoseSchema.safeParse(file);

        if (!parsed.success) {
            return res.status(400).json({
                errors: parsed.error.issues.map((i) => ({
                    field: i.path.join("."),
                    message: i.message,
                })),
            });
        }

        const jobId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const framesDir = path.join("tmp", "frames", jobId);
        const fps = 30;

        const t1 = performance.now();
        const framePaths = await extractFrames(file.path, framesDir, fps);
        const t2 = performance.now();

        const framesRaw = await estimatePoseOnFrames(framePaths, fps);
        const frames = normalizeFrameTimes(framesRaw as any[], fps);
        const t3 = performance.now();

        // Optional: quick sanity log (remove later)
        // console.log("t0,t1,tLast,dt", frames[0]?.t, frames[1]?.t, frames[frames.length - 1]?.t, frames[1]?.t - frames[0]?.t);

        const result = countPushups(frames as any);
        const t4 = performance.now();

        await fs.rm(framesDir, { recursive: true, force: true });
        await fs.rm(file.path, { force: true });
        const t5 = performance.now();

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
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: e?.message ?? "Pose analysis failed." });
    }
}
