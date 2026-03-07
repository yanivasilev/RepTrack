import { PushupFeedbackType } from "./PushupFeedbackType";
import { RepFeedbackType } from "./RepFeedbackType";

export type PushupResultType = {
    reps: number;
    feedback: PushupFeedbackType;
    repFeedbacks: RepFeedbackType[];
    goodReps: number;
    badReps: number;
};
