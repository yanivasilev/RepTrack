import { RepFeedbackCode } from "./RepFeedbackCode";

export type RepFeedback = {
    repIndex: number;
    tStart: number;
    tEnd: number;
    code: RepFeedbackCode;
    message: string;
    metrics: {
        duration: number;
        travel: number;
        travelFrac: number;
        minElbowAngle: number;
        minPlankAngle: number;
        confidenceFrames: number;
        missingFrames: number;
        signal: "ELBOW" | "SHOULDER_Y";
    };
};