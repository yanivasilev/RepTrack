import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs/promises";

export async function extractFrames(
    videoPath: string,
    framesDir: string,
    fps: number
): Promise<string[]> {
    if (!ffmpegPath) throw new Error("ffmpeg-static binary not found");

    await fs.mkdir(framesDir, { recursive: true });

    const outputPattern = path.join(framesDir, "frame_%06d.jpg");
    const args = [
        "-i", videoPath,
        "-vf", `fps=${fps},scale=640:-1`,
        "-q:v", "3",
        outputPattern,
    ];

    await new Promise<void>((resolve, reject) => {
        const p = spawn(ffmpegPath as string, args);
        p.on("error", reject);
        p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
    });

    const files = (await fs.readdir(framesDir))
        .filter((f) => f.endsWith(".jpg"))
        .sort();

    if (files.length === 0) throw new Error("No frames extracted from video");

    return files.map((f) => path.join(framesDir, f));
}
