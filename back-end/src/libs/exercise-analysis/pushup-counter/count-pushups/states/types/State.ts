import { Phase } from "./Phase";
import { Signal } from "./Signal";

export type State = {
    phase: Phase;
    reps: number;
    repStartT: number | null;
    topShoulderY: number | null;
    bottomShoulderY: number | null;
    torsoLen: number | null;
    minElbowAngle: number | null;
    minPlankAngle: number | null;
    elbowSmoothed: number | null;
    confidenceFrames: number;
    missingFrames: number;
    repSignal: Signal;
    repFrameCount: number;
};