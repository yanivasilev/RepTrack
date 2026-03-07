import { PoseKeypointType } from "./PoseKeypointType";

export type PoseFrameType = {
    t: number;
    keypoints: PoseKeypointType[];
};
