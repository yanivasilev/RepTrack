import { Keypoints } from "../types/Keypoints";
import { getKeypoints } from "./getKeypoints";
import { ShoulderSide } from "./types/ShoulderSide";

export function getShoulderY(kps: Keypoints[], side: ShoulderSide, minScore: number) {
    const sh = getKeypoints(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    if (!sh || sh.score < minScore) return null;

    return sh.y;
}