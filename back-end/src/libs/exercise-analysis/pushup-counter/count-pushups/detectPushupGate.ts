import { PoseFrame } from "../../types/PoseFrame";
import { elbowAngleFromFrame } from "../elbowAngleFromFrame";
import { getShoulderY } from "../getShoulderY";
import { pickBestSide } from "../pickBestSide";
import { CONFIG } from "./config";

// CHECKS IF VIDEO PASSES ELBOW ANGLE OR SHOULDER MOTION EVIDENCE TO DECIDE IF VIDEO CONTAINES PUSH UPS
export function detectPushupGate(frames: PoseFrame[]) {
    let usedFrames = 0;
    let gateHits = 0;
    let shoulderMotionHits = 0;
    let prevShoulderY: number | null = null;

    for (const frame of frames) {
        const side = pickBestSide(frame.keypoints, CONFIG.KEYPOINT.MIN_SCORE);
        if (!side) continue;

        const shoulderY = getShoulderY(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);
        const elbow = elbowAngleFromFrame(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);

        if (shoulderY == null && elbow == null) continue;

        usedFrames += 1;

        if (elbow != null && elbow > CONFIG.GATE.MIN_ELBOW_ANGLE_DEG && elbow < CONFIG.GATE.MAX_ELBOW_ANGLE_DEG) gateHits += 1;
        if (shoulderY != null && prevShoulderY != null && Math.abs(shoulderY - prevShoulderY) > CONFIG.GATE.MIN_SHOULDER_DELTA) shoulderMotionHits += 1;
        if (shoulderY != null) prevShoulderY = shoulderY;
    }

    const isLikelyPushup = gateHits >= CONFIG.GATE.MIN_HIT_FRAMES || shoulderMotionHits >= CONFIG.GATE.MIN_HIT_FRAMES;

    return {
        isLikelyPushup,
        usedFrames,
        gateHits,
        shoulderMotionHits,
    };
}
