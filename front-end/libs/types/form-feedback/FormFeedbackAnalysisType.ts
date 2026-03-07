import { PoseFrameType } from "./PoseFrameType";
import { PushupResultType } from "./PushupResultType";

export type FormFeedbackAnalysisType = PushupResultType & {
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
