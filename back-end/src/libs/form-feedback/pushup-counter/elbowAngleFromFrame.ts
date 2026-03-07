import { Keypoints } from "../types/Keypoints";
import { angleBetweenPoints } from "./angleBetweenPoints";
import { getKeypoints } from "./getKeypoints";
import { ShoulderSide } from "./types/ShoulderSide";

export function elbowAngleFromFrame(kps: Keypoints[], side: ShoulderSide, minScore: number) {
    const s = getKeypoints(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const e = getKeypoints(kps, side === "left" ? "left_elbow" : "right_elbow");
    const w = getKeypoints(kps, side === "left" ? "left_wrist" : "right_wrist");

    // ELBOW ANGLE NEEDS WRIST IF MISSING FALLBACK TO SHOULDER
    if (!s || !e || !w) return null;
    if (s.score < minScore || e.score < minScore || w.score < minScore) return null;

    return angleBetweenPoints(s, e, w);
}