import { CONFIG } from "../config";

export function checkRepEnd(elbowAngle: number | null, shoulderY: number | null, topShoulderY: number | null, bottomShoulderY: number | null, endUpThreshold: number) {
    const endByElbow = elbowAngle != null && elbowAngle > CONFIG.ANGLE.ABS_END_UP_ELBOW_DEG;

    const endByY = elbowAngle == null && shoulderY != null && topShoulderY != null && bottomShoulderY != null && bottomShoulderY - shoulderY >= endUpThreshold;

    return endByElbow || endByY;
}
