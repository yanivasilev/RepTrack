import { CONFIG } from "../config";

export function checkRepStart(elbowAngle: number | null, shoulderY: number | null, topShoulderY: number | null, startDownThreshold: number) {
    const startByElbow = elbowAngle != null && elbowAngle < CONFIG.ANGLE.ABS_END_UP_ELBOW_DEG;

    const startByY = elbowAngle == null && shoulderY != null && topShoulderY != null && shoulderY - topShoulderY >= startDownThreshold;

    return {
        start: startByElbow || startByY,
        signal: startByElbow ? ("ELBOW" as const) : ("SHOULDER_Y" as const),
    };
}
