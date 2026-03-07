import { Keypoints } from "../types/Keypoints";
import { angleBetweenPoints } from "./angleBetweenPoints";
import { getKeypoints } from "./getKeypoints";
import { ShoulderSide } from "./types/ShoulderSide";

// SHOULDER HIP ANGLE USED FOR HOW STRAIGHT IS PLANK
export function hipPlankAngleFromFrame(kps: Keypoints[], side: ShoulderSide, minScore: number) {
    const sh = getKeypoints(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const hp = getKeypoints(kps, side === "left" ? "left_hip" : "right_hip");
    const an = getKeypoints(kps, side === "left" ? "left_ankle" : "right_ankle");

    if (!sh || !hp || !an) return null;
    if (sh.score < minScore || hp.score < minScore || an.score < minScore) return null;

    return angleBetweenPoints(sh, hp, an);
}