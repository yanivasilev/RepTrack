import { estimatePoseOnImagePath } from "./estimatePostOnImagePath";
import { PoseFrame } from "./types/PoseFrame";

// ESTIMATES POSE ON A SEQUENCE OF FRAME IMAGES
export async function estimatePoseOnFrames(framePaths: string[], fps: number): Promise<PoseFrame[]> {
    const out: PoseFrame[] = [];

    for (let i = 0; i < framePaths.length; i++) {
        console.log(`Pose frame ${i + 1}/${framePaths.length}`);
        const pose = await estimatePoseOnImagePath(framePaths[i]);

        out.push({
            t: i / fps,
            score: pose.score,
            keypoints: pose.keypoints,
            frameWidth: pose.frameWidth,
            frameHeight: pose.frameHeight,
        });
    }

    return out;
}
