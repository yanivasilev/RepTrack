import path from "path";
import fs from "fs/promises";
import { prisma } from "../../db";
import { Video } from "../../libs/exercise-analysis/types/Video";
import { estimatePoseOnFrames } from "../../libs/exercise-analysis/extimatePoseOnFrames";
import { extractFrames } from "../../utils/exercise-analysis/extractFrames";
import { normaliseFrameTimes } from "../../utils/exercise-analysis/normaliseFrameTimes";
import { countPushups } from "../../libs/exercise-analysis/pushup-counter/count-pushups/countPushups";

const KEYPOINT_NAMES = new Set([
    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    "left_wrist",
    "right_wrist",
    "left_hip",
    "right_hip",
    "left_knee",
    "right_knee",
    "left_ankle",
    "right_ankle",
]);

export async function exerciseAnalysisService(exerciseId: number, video: Video) {
    const timeStart = performance.now();

    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        select: {
            id: true,
            name: true,
            category: true,
            muscleGroup: true,
            equipment: true,
            isBodyweight: true,
            exerciseType: true,
            createdAt: true,
        },
    });

    if (!exercise) return { status: "not_found" as const };
    if (exercise.name !== "Push-up") return { status: "exercise_not_supported" as const }

    const jobId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const framesDir = path.join("tmp", "frames", jobId);
    const fps = 30;

    const framePaths = await extractFrames(video.uri, framesDir, fps);

    const framesRaw = await estimatePoseOnFrames(framePaths, fps);
    // NORMALISE FRAME TIMESTAMPS SO REP TIMING IS CONSITENT ACROSS VIDEO
    const frames = normaliseFrameTimes(framesRaw as any[], fps);

    const result = countPushups(frames as any);

    await fs.rm(framesDir, { recursive: true, force: true });
    await fs.rm(video.uri, { force: true });

    const firstFrame = frames[0] as { frameWidth?: number; frameHeight?: number } | undefined;
    const frameWidth = firstFrame?.frameWidth ?? 1;
    const frameHeight = firstFrame?.frameHeight ?? 1;

    const poseFrames = frames.map((frame: any) => ({
        t: frame.t,
        keypoints: Array.isArray(frame.keypoints)
            ? frame.keypoints
                .filter((kp: any) => KEYPOINT_NAMES.has(String(kp.name)))
                .map((kp: any) => ({
                    name: kp.name,
                    x: Math.max(0, Math.min(1, kp.x / (frame.frameWidth ?? frameWidth))),
                    y: Math.max(0, Math.min(1, kp.y / (frame.frameHeight ?? frameHeight))),
                    score: kp.score,
                }))
            : [],
    }));

    const repFeedbacks = result.repFeedbacks.map((rep) => ({
        repIndex: rep.repIndex,
        tStart: rep.tStart,
        tEnd: rep.tEnd,
        code: rep.code,
        message: rep.message,
    }));

    const timeEnd = performance.now();

    return {
        fps,
        poseMeta: {
            frameWidth,
            frameHeight,
        },
        poseFrames,
        reps: result.reps,
        feedback: result.feedback,
        repFeedbacks,
        goodReps: result.goodReps,
        badReps: result.badReps,
        timingsMs: {
            total: Math.round(timeEnd - timeStart),
        },
    };
}
