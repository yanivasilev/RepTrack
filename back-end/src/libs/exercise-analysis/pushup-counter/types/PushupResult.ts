import { PushupFeedback } from "./PushupFeedback";
import { RepFeedback } from "./RepFeedback";

export type PushupResult = {
    reps: number;
    feedback: PushupFeedback;
    repFeedbacks: RepFeedback[];
    goodReps: number;
    badReps: number;
};
