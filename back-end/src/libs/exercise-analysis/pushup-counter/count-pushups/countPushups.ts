import { PoseFrame } from "../../types/PoseFrame";
import { distance } from "../distance";
import { elbowAngleFromFrame } from "../elbowAngleFromFrame";
import { getShoulderAndHip } from "../getShoulderAndHip";
import { getShoulderY } from "../getShoulderY";
import { gradeRep } from "../gradeRep";
import { hipPlankAngleFromFrame } from "../hipPlankAngleFromFrame";
import { pickBestSide } from "../pickBestSide";
import { smooth } from "../smooth";
import { PushupResult } from "../types/PushupResult";
import { RepFeedback } from "../types/RepFeedback";
import { detectPushupGate } from "./detectPushupGate";
import { CONFIG } from "./config";
import { getDynamicThresholds } from "./transitions/getDynamicThresholds";

export function countPushups(frames: PoseFrame[], opts?: { onRep?: (rep: RepFeedback) => void }): PushupResult {
    // CHECKS IF THE VIDEO CONTAINS PUSH UPS IF NOT SKIPS THE WHOLE PROCCESS TO COUNT PUSHUPS
    const gate = detectPushupGate(frames);

    if (!gate.isLikelyPushup || gate.gateHits < CONFIG.GATE.MIN_HIT_FRAMES) {
        return {
            reps: 0,
            feedback: { code: "NOT_PUSHUP", message: "Not a pushup posture." },
            repFeedbacks: [],
            goodReps: 0,
            badReps: 0,
        };
    }

    let phase: "UP" | "DOWN" = "UP";
    let nextRepAllowedAt = Number.NEGATIVE_INFINITY;

    let torsoLen: number | null = null;
    let elbowSmoothed: number | null = null;

    let topElbow: number | null = null;
    let bottomElbow: number | null = null;
    let topShoulderY: number | null = null;
    let bottomShoulderY: number | null = null;

    let repStartT: number | null = null;
    let repFrameCount = 0;
    let confidenceFrames = 0;
    let missingFrames = 0;
    let minElbowAngle: number | null = null;
    let minPlankAngle: number | null = null;
    let repSignal: "ELBOW" | "SHOULDER_Y" = "ELBOW";

    const repFeedbacks: RepFeedback[] = [];

    // RESETS ONLY FOR EACH REP BETWEEN ATTEMPTS
    const resetRep = () => {
        repStartT = null;
        repFrameCount = 0;
        confidenceFrames = 0;
        missingFrames = 0;
        minElbowAngle = null;
        minPlankAngle = null;
        bottomElbow = null;
        bottomShoulderY = null;
        repSignal = "ELBOW";
    };

    // FRAME BY FRAME STATE MACHINE (UP -> DOWN -> UP FOR EACH REP CYCLE)
    for (const frame of frames) {
        // PICKS THE RELIABLE SIDE FOR THE FRAME BASED ON KEYPOINT CONFIDENCE
        const side = pickBestSide(frame.keypoints, CONFIG.KEYPOINT.MIN_SCORE);

        if (!side) {
            // IF TRACKING IS LOST DURING PHASE DOWN, ALLOW A MISSED FRAMES BEFORE CLOSING THE REP
            if (phase === "DOWN") {
                missingFrames += 1;

                if (missingFrames > CONFIG.REP.MAX_MISSING_FRAMES) {
                    if (repStartT != null && repFrameCount >= CONFIG.REP.MIN_FRAMES) {
                        const duration = frame.t - repStartT;
                        const travel =
                            topShoulderY != null && bottomShoulderY != null
                                ? bottomShoulderY - topShoulderY
                                : 0;
                        const travelFrac = torsoLen && torsoLen > 0 ? travel / torsoLen : Math.abs(travel);

                        repFeedbacks.push({
                            repIndex: repFeedbacks.length + 1,
                            tStart: repStartT,
                            tEnd: frame.t,
                            code: "LOW_CONFIDENCE",
                            message: "Tracking was lost during the rep.",
                            metrics: {
                                duration,
                                travel,
                                travelFrac,
                                minElbowAngle: minElbowAngle ?? 999,
                                minPlankAngle: minPlankAngle ?? 999,
                                confidenceFrames,
                                missingFrames,
                                signal: repSignal,
                            },
                        });
                    }

                    nextRepAllowedAt = frame.t + CONFIG.REP.START_COOLDOWN_SECONDS;
                    phase = "UP";
                    resetRep();
                }
            }
            continue;
        }

        const elbowRaw = elbowAngleFromFrame(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);
        const shoulderY = getShoulderY(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);
        const shoulderAndHip = getShoulderAndHip(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);
        const plankAngle = hipPlankAngleFromFrame(frame.keypoints, side, CONFIG.KEYPOINT.MIN_SCORE);

        // KEEP SMOOTH TORSO ESTIMATE SO MOVEMENT THRESHOLDS SCALE WITH BODY SIZE
        if (shoulderAndHip) {
            const torso = distance(shoulderAndHip.shoulder, shoulderAndHip.hip);
            if (torso > 1) torsoLen = torsoLen == null ? torso : torsoLen * 0.9 + torso * 0.1;
        }

        if (elbowRaw == null && shoulderY == null) {
            // SAME LOST TRACKING AS PHASE DOWN ABOVE WHEN THE FRAME HAS NO USABLE ELBOW OR SHOULDER
            if (phase === "DOWN") {
                missingFrames += 1;

                if (missingFrames > CONFIG.REP.MAX_MISSING_FRAMES) {
                    if (repStartT != null && repFrameCount >= CONFIG.REP.MIN_FRAMES) {
                        const duration = frame.t - repStartT;
                        const travel = topShoulderY != null && bottomShoulderY != null ? bottomShoulderY - topShoulderY : 0;
                        const travelFrac = torsoLen && torsoLen > 0 ? travel / torsoLen : Math.abs(travel);

                        repFeedbacks.push({
                            repIndex: repFeedbacks.length + 1,
                            tStart: repStartT,
                            tEnd: frame.t,
                            code: "LOW_CONFIDENCE",
                            message: "Tracking was lost during the rep.",
                            metrics: {
                                duration,
                                travel,
                                travelFrac,
                                minElbowAngle: minElbowAngle ?? 999,
                                minPlankAngle: minPlankAngle ?? 999,
                                confidenceFrames,
                                missingFrames,
                                signal: repSignal,
                            },
                        });
                    }

                    nextRepAllowedAt = frame.t + CONFIG.REP.START_COOLDOWN_SECONDS;
                    phase = "UP";
                    resetRep();
                }
            }
            continue;
        }

        confidenceFrames += 1;

        // SMOOTH ELBOW ANGLE TO RECUDE FRAME TO FRAME SHAKE BEFORE THRESHOLD CHECKS
        const elbow = elbowRaw == null ? null : (elbowSmoothed = smooth(elbowSmoothed, elbowRaw, CONFIG.SMOOTHING.ELBOW_ALPHA));

        if (phase === "UP") {
            // SHORT COOLDOWN TO PREVENT DOUBLE COUNTING ON NOISY BOUNCE NEAR TOP POSITION
            if (frame.t < nextRepAllowedAt) continue;

            // TRACK TOP BASELINE WHILE WATING TO GO DOWN
            if (elbow != null) topElbow = topElbow == null ? elbow : Math.max(topElbow, elbow);
            if (shoulderY != null) topShoulderY = topShoulderY == null ? shoulderY : Math.min(topShoulderY, shoulderY);

            const thresholds = getDynamicThresholds(torsoLen);

            // START REP WHEN GOING DOWN BY ELBOW DROP OR SHOULDER FOR FALLBACK
            const startByElbow = elbow != null && topElbow != null && topElbow - elbow >= CONFIG.ANGLE.START_DROP_DEG;
            const startByY = !startByElbow && shoulderY != null && topShoulderY != null && shoulderY - topShoulderY >= thresholds.startDown;

            if (startByElbow || startByY) {
                // ENTER DOWN PHASE AND INITIALISE FOR EACH REP TRACKING
                phase = "DOWN";
                repStartT = frame.t;
                repFrameCount = 1;
                confidenceFrames = 0;
                missingFrames = 0;
                repSignal = startByElbow ? "ELBOW" : "SHOULDER_Y";

                bottomElbow = elbow;
                bottomShoulderY = shoulderY;
                minElbowAngle = elbow;
                minPlankAngle = plankAngle;
            }

            continue;
        }

        // GETS REP STATS AND WATCHES FOR RETURN TO THE TOP
        repFrameCount += 1;

        if (shoulderY != null) bottomShoulderY = bottomShoulderY == null ? shoulderY : Math.max(bottomShoulderY, shoulderY);
        if (elbow != null) bottomElbow = bottomElbow == null ? elbow : Math.min(bottomElbow, elbow);
        if (elbow != null) minElbowAngle = minElbowAngle == null ? elbow : Math.min(minElbowAngle, elbow);
        if (plankAngle != null) minPlankAngle = minPlankAngle == null ? plankAngle : Math.min(minPlankAngle, plankAngle);

        const thresholds = getDynamicThresholds(torsoLen);
        const endByElbow = elbow != null && bottomElbow != null && (elbow >= bottomElbow + CONFIG.ANGLE.END_RISE_DEG || elbow >= CONFIG.ANGLE.ABS_END_UP_ELBOW_DEG);

        // SHOULDER IS FALLBACK WHEN ELBOW END ISN'T FOUND
        const endByY = !endByElbow && shoulderY != null && topShoulderY != null && bottomShoulderY != null && bottomShoulderY - shoulderY >= thresholds.endUp;

        if (!endByElbow && !endByY) {
            // IF USER STAYS IN PHASE DOWN TOO LONG, CLOSE AS IN COMPLETE REP
            const inDownTooLong = repStartT != null && (frame.t - repStartT) > 2.0;

            if (inDownTooLong) {
                if (repFrameCount >= CONFIG.REP.MIN_FRAMES) {
                    const duration = frame.t - repStartT!;
                    const travel = topShoulderY != null && bottomShoulderY != null ? bottomShoulderY - topShoulderY : 0;
                    const travelFrac = torsoLen && torsoLen > 0 ? travel / torsoLen : Math.abs(travel);

                    repFeedbacks.push({
                        repIndex: repFeedbacks.length + 1,
                        tStart: repStartT!,
                        tEnd: frame.t,
                        code: "BAD_PLANK",
                        message: "Rep not completed with stable form.",
                        metrics: {
                            duration,
                            travel,
                            travelFrac,
                            minElbowAngle: minElbowAngle ?? 999,
                            minPlankAngle: minPlankAngle ?? 999,
                            confidenceFrames,
                            missingFrames,
                            signal: repSignal,
                        },
                    });
                }

                nextRepAllowedAt = frame.t + CONFIG.REP.START_COOLDOWN_SECONDS;
                phase = "UP";
                resetRep();

                if (elbow != null) topElbow = elbow;
                if (shoulderY != null) topShoulderY = shoulderY;

                continue;
            }

            continue;
        }

        // REP FINISHED AND GRADE REP NOW
        if (repStartT != null) {
            const duration = frame.t - repStartT;
            if (duration >= CONFIG.REP.MIN_DURATION_SECONDS && duration <= CONFIG.REP.MAX_DURATION_SECONDS && repFrameCount >= CONFIG.REP.MIN_FRAMES) {
                const travel = topShoulderY != null && bottomShoulderY != null ? bottomShoulderY - topShoulderY : 0;
                const travelFrac = torsoLen && torsoLen > 0 ? travel / torsoLen : Math.abs(travel);
                const lowConfidence = confidenceFrames < CONFIG.REP.MIN_CONFIDENCE_FRAMES || missingFrames > CONFIG.REP.MAX_MISSING_FRAMES;

                const graded = gradeRep({
                    duration,
                    travelFrac,
                    minElbowAngle: minElbowAngle ?? 999,
                    minPlankAngle: minPlankAngle ?? 999,
                    lowConfidence,
                });

                const rep: RepFeedback = {
                    repIndex: repFeedbacks.length + 1,
                    tStart: repStartT,
                    tEnd: frame.t,
                    code: graded.code,
                    message: graded.message,
                    metrics: {
                        duration,
                        travel,
                        travelFrac,
                        minElbowAngle: minElbowAngle ?? 999,
                        minPlankAngle: minPlankAngle ?? 999,
                        confidenceFrames,
                        missingFrames,
                        signal: repSignal,
                    },
                };

                repFeedbacks.push(rep);
                opts?.onRep?.(rep);
            }
        }

        // RESETS REP
        nextRepAllowedAt = frame.t + CONFIG.REP.START_COOLDOWN_SECONDS;
        phase = "UP";
        resetRep();

        if (elbow != null) topElbow = elbow;
        if (shoulderY != null) topShoulderY = shoulderY;
    }

    const goodReps = repFeedbacks.filter((rep) => rep.code === "GOOD").length;
    const badReps = repFeedbacks.length - goodReps;

    return {
        reps: repFeedbacks.length,
        feedback:
            repFeedbacks.length === 0
                ? { code: "NO_REPS", message: "No reps detected." }
                : { code: "OK", message: "Detected reps." },
        repFeedbacks,
        goodReps,
        badReps,
    };
}
