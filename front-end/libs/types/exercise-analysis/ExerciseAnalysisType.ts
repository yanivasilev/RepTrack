import { PoseFrameType } from "./PoseFrameType";
import { PushupResultType } from "./PushupResultType";

export type ExerciseAnalysisType = PushupResultType & {
    fps: number;
    poseMeta: {
        frameWidth: number;
        frameHeight: number;
    };
    poseFrames: PoseFrameType[];
    timingsMs: {
        total: number;
    };
};
