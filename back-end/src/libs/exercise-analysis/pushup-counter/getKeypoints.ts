import { Keypoints } from "../types/Keypoints";

export function getKeypoints(kps: Keypoints[], name: string) {
    return kps.find((k) => k.name === name);
}
