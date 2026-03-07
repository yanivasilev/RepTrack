import { Keypoints } from "./Keypoints";

export type PoseFrame = {
    t: number;
    score: number;
    keypoints: Keypoints[];
    frameWidth: number;
    frameHeight: number;
};
