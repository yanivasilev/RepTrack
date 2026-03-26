import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs/promises";

// EXTRACTS FRAMES FROM VIDEO USINGF FFMPEG
export async function extractFrames(videoPath: string, framesDir: string, fps: number): Promise<string[]> {
    if (!ffmpegPath) throw new Error("Ffmpeg not found.");

    // CHECKS IF INPUT EXISTS AND DIR IS READY
    await fs.access(videoPath);
    await fs.mkdir(framesDir, { recursive: true });

    // EXTRACTS FRAMES AT GIVEN FPS AND RESIZE TO MAX WIDTH WHICH IS 640
    const outputPattern = path.join(framesDir, "frame_%06d.jpg");
    const args = [
        "-y",
        "-i", videoPath,
        "-vf", `fps=${fps},scale=640:-1`,
        "-q:v", "3",
        outputPattern,
    ];

    // RUNS FFMPEG PROCESS
    await new Promise<void>((resolve, reject) => {
        const p = spawn(ffmpegPath as string, args);
        let stderr = "";

        p.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        p.on("error", reject);
        p.on("exit", (code) => {
            if (code === 0) return resolve();
            const details = stderr.trim();
            return reject(new Error(details ? `Ffmpeg exit ${code}: ${details}` : `Ffmpeg exit ${code}`));
        });
    });

    // COLLECTS GENERATED FRAME FILES
    const files = (await fs.readdir(framesDir))
        .filter((f) => f.endsWith(".jpg"))
        .sort();

    if (files.length === 0) throw new Error("No frames extracted from video.");

    return files.map((f) => path.join(framesDir, f));
}
