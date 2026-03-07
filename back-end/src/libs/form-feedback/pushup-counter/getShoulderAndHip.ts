import { Keypoints } from "../types/Keypoints";
import { getKeypoints } from "./getKeypoints";
import { ShoulderSide } from "./types/ShoulderSide";

// RETUNRS SAME SIDE SHOULDER ONLY WHEN BOTH KPS ARE THERE AND HAVE GOOD CONFIDENCE
export function getShoulderAndHip(kps: Keypoints[], side: ShoulderSide, minScore: number) {
    const sh = getKeypoints(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const hp = getKeypoints(kps, side === "left" ? "left_hip" : "right_hip");

    if (!sh || !hp) return null;
    if (sh.score < minScore || hp.score < minScore) return null;

    return { shoulderY: sh.y, hipY: hp.y, shoulder: sh, hip: hp };
}