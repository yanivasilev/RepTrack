import { PoseKeypointType } from "../../types/exercise-analysis/PoseKeypointType";
import { DrawBox } from "../../types/video-preview/DrawBox";
import { KeypointByName } from "../../types/video-preview/KeypointByName";
import { mapNormalizedPointToBox } from "./mapNormalisedPointToBox";

export function getKeypointsByName(keypoints: PoseKeypointType[], drawBox: DrawBox): Map<string, KeypointByName> {
    const map = new Map<string, KeypointByName>();

    keypoints.forEach((kp) => {
        const point = mapNormalizedPointToBox(kp.x, kp.y, drawBox);
        map.set(kp.name, { ...point, score: kp.score });
    });

    return map;
}
