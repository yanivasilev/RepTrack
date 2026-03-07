import { Keypoints } from "../types/Keypoints";
import { getKeypoints } from "./getKeypoints";
import { ShoulderSide } from "./types/ShoulderSide";

// SELECTS BEST SHOULDER SIDE BASED ON CONFIDENCE
export function pickBestSide(kps: Keypoints[], minScore: number): ShoulderSide | null {
    const ls = getKeypoints(kps, "left_shoulder");
    const le = getKeypoints(kps, "left_elbow");
    const lw = getKeypoints(kps, "left_wrist");

    const rs = getKeypoints(kps, "right_shoulder");
    const re = getKeypoints(kps, "right_elbow");
    const rw = getKeypoints(kps, "right_wrist");

    // REQUIRE SHOULDER + ELBOW TO CONSIDER A SIDE VISIBLE
    const leftSE = ls && le && ls.score > minScore && le.score > minScore;
    const rightSE = rs && re && rs.score > minScore && re.score > minScore;

    // PREFER SIDES WHERE THE WRIST ALSO HAS HIGH CONFIDENCE
    const leftFull = leftSE && lw && lw.score > minScore;
    const rightFull = rightSE && rw && rw.score > minScore;

    if (leftFull && rightFull) {
        const leftSum = ls!.score + le!.score + lw!.score;
        const rightSum = rs!.score + re!.score + rw!.score;

        return leftSum >= rightSum ? "left" : "right";
    }

    if (leftFull) return "left";
    if (rightFull) return "right";

    // FALLBACK CHOOSE A SIDE WITH BETTER SHOULDER + ELBOW (IF NO WRISTS)
    if (leftSE && rightSE) {
        const leftSum = ls!.score + le!.score;
        const rightSum = rs!.score + re!.score;

        return leftSum >= rightSum ? "left" : "right";
    }

    if (leftSE) return "left";
    if (rightSE) return "right";

    return null;
}