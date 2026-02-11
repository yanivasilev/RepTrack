// src/pose/pushupCounter.ts

export type KP = { name: string; x: number; y: number; score: number };
export type PoseFrame = { t: number; score: number; keypoints: KP[] };

export type PushupFeedbackCode = "NOT_PUSHUP" | "NO_REPS" | "OK";

export type RepFeedbackCode =
    | "GOOD"
    | "TOO_SHALLOW"
    | "BAD_PLANK"
    | "TOO_FAST"
    | "TOO_SLOW"
    | "NO_TRAVEL"
    | "LOW_CONFIDENCE";

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
        minElbowAngle: number; // 999 if not available
        minPlankAngle: number; // 999 if not available
        confidenceFrames: number;
        missingFrames: number;
        signal: "ELBOW" | "SHOULDER_Y";
    };
};

export type PushupFeedback = {
    code: PushupFeedbackCode;
    message: string;
};

export type PushupResult = {
    reps: number; // total rep attempts detected
    usedFrames: number;
    isLikelyPushup: boolean;
    feedback: PushupFeedback;
    repFeedbacks: RepFeedback[];
    goodReps: number;
    badReps: number;
    debug?: any;
};

function getPoint(kps: KP[], name: string) {
    return kps.find((k) => k.name === name);
}

// angle ABC at B
function angleDeg(a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) {
    const abx = a.x - b.x,
        aby = a.y - b.y;
    const cbx = c.x - b.x,
        cby = c.y - b.y;

    const dot = abx * cbx + aby * cby;
    const magAB = Math.hypot(abx, aby);
    const magCB = Math.hypot(cbx, cby);

    const cos = dot / (magAB * magCB + 1e-9);
    const rad = Math.acos(Math.max(-1, Math.min(1, cos)));
    return (rad * 180) / Math.PI;
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

type Side = "left" | "right";

/**
 * MUCH more forgiving side picker:
 * - prefers full arm (shoulder+elbow+wrist) if available
 * - falls back to shoulder+elbow if wrist is unreliable
 */
function pickBestSide(kps: KP[], minScore: number): Side | null {
    const ls = getPoint(kps, "left_shoulder");
    const le = getPoint(kps, "left_elbow");
    const lw = getPoint(kps, "left_wrist");

    const rs = getPoint(kps, "right_shoulder");
    const re = getPoint(kps, "right_elbow");
    const rw = getPoint(kps, "right_wrist");

    const leftSE = ls && le && ls.score > minScore && le.score > minScore;
    const rightSE = rs && re && rs.score > minScore && re.score > minScore;

    // if we have wrists too, weight them
    const leftFull = leftSE && lw && lw.score > minScore;
    const rightFull = rightSE && rw && rw.score > minScore;

    if (leftFull && rightFull) {
        const leftSum = ls!.score + le!.score + lw!.score;
        const rightSum = rs!.score + re!.score + rw!.score;
        return leftSum >= rightSum ? "left" : "right";
    }
    if (leftFull) return "left";
    if (rightFull) return "right";

    // fallback without wrist
    if (leftSE && rightSE) {
        const leftSum = ls!.score + le!.score;
        const rightSum = rs!.score + re!.score;
        return leftSum >= rightSum ? "left" : "right";
    }
    if (leftSE) return "left";
    if (rightSE) return "right";

    return null;
}

function elbowAngleFromFrame(kps: KP[], side: Side, minScore: number) {
    const s = getPoint(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const e = getPoint(kps, side === "left" ? "left_elbow" : "right_elbow");
    const w = getPoint(kps, side === "left" ? "left_wrist" : "right_wrist");

    // elbow angle needs wrist; if wrist missing => null (we'll fall back to shoulder Y)
    if (!s || !e || !w) return null;
    if (s.score < minScore || e.score < minScore || w.score < minScore) return null;

    return angleDeg(s, e, w);
}

/**
 * Hip angle shoulder-hip-ankle: near 180 means straight plank-ish.
 * NOTE: used for feedback only (not required to count reps).
 */
function hipPlankAngleFromFrame(kps: KP[], side: Side, minScore: number) {
    const sh = getPoint(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const hp = getPoint(kps, side === "left" ? "left_hip" : "right_hip");
    const an = getPoint(kps, side === "left" ? "left_ankle" : "right_ankle");

    if (!sh || !hp || !an) return null;
    if (sh.score < minScore || hp.score < minScore || an.score < minScore) return null;

    return angleDeg(sh, hp, an);
}

function shoulderAndHipY(kps: KP[], side: Side, minScore: number) {
    const sh = getPoint(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    const hp = getPoint(kps, side === "left" ? "left_hip" : "right_hip");
    if (!sh || !hp) return null;
    if (sh.score < minScore || hp.score < minScore) return null;
    return { shoulderY: sh.y, hipY: hp.y, shoulder: sh, hip: hp };
}

function shoulderYFromFrame(kps: KP[], side: Side, minScore: number) {
    const sh = getPoint(kps, side === "left" ? "left_shoulder" : "right_shoulder");
    if (!sh || sh.score < minScore) return null;
    return sh.y;
}

// smoothing helper
function smooth(prev: number | null, next: number, alpha: number) {
    return prev == null ? next : prev * alpha + next * (1 - alpha);
}

function gradeRep(m: {
    duration: number;
    travelFrac: number;
    minElbowAngle: number; // 999 if unknown
    minPlankAngle: number; // 999 if unknown
    lowConfidence: boolean;
}) {
    // Tunables
    const DEPTH_GOOD = 115; // <= deeper is better
    const PLANK_GOOD = 155;

    const MIN_TRAVEL_FRAC = 0.06; // easier: detects more reps; "NO_TRAVEL" if below
    const FAST = 0.30;
    const SLOW = 6.5;

    if (m.lowConfidence) {
        return { code: "LOW_CONFIDENCE" as const, message: "Tracking was shaky—try better lighting and keep full body in frame." };
    }
    if (m.travelFrac < MIN_TRAVEL_FRAC) {
        return { code: "NO_TRAVEL" as const, message: "Make the motion bigger—lower your chest more." };
    }
    if (m.duration < FAST) {
        return { code: "TOO_FAST" as const, message: "Slow down—control the rep." };
    }
    if (m.duration > SLOW) {
        return { code: "TOO_SLOW" as const, message: "A bit quicker—keep a steady tempo." };
    }
    if (m.minPlankAngle !== 999 && m.minPlankAngle < PLANK_GOOD) {
        return { code: "BAD_PLANK" as const, message: "Keep a straighter line—avoid hips hiking/sagging." };
    }
    if (m.minElbowAngle !== 999 && m.minElbowAngle > DEPTH_GOOD) {
        return { code: "TOO_SHALLOW" as const, message: "Go lower for full depth." };
    }
    return { code: "GOOD" as const, message: "Good rep!" };
}

/**
 * Counts pushups (rep attempts) + per-rep feedback.
 * Designed to detect reps even with partial tracking:
 * - Primary signal: elbow angle (needs wrist)
 * - Fallback: shoulder Y (down then up)
 */
export function countPushups(
    frames: PoseFrame[],
    opts?: { onRep?: (rep: RepFeedback) => void }
): PushupResult {
    // -----------------------
    // TUNABLE PARAMETERS
    // -----------------------
    const MIN_KP_SCORE = 0.35;

    // Hysteresis thresholds for elbow signal (loose = more reps detected)
    const DOWN_ANGLE = 135;
    const UP_ANGLE = 145;

    // Shoulder-Y fallback thresholds
    // These values work for both normalized and pixel-ish coords by using torso length when possible.
    const START_DOWN_FRACTION = 0.06; // start rep if shoulder moved down >= 6% torso len
    const END_UP_FRACTION = 0.05; // end rep if shoulder moved up from bottom >= 5% torso len

    // sanity bounds (seconds)
    const ABS_MIN_REP_SECONDS = 0.20;
    const ABS_MAX_REP_SECONDS = 12.0;

    // allow brief missing frames during a rep
    const MAX_MISSING_FRAMES_DURING_REP = 6;

    // smoothing for elbow angle to reduce jitter
    const ELBOW_SMOOTH_ALPHA = 0.75;

    // session gate: very light (avoid NOT_PUSHUP false negatives)
    const MIN_GATE_FRAMES = 3;

    // -----------------------
    // PASS 1: lightweight "is this roughly pushup motion" gate
    // (We only need some elbow OR shoulder motion evidence.)
    // -----------------------
    let usedFrames = 0;
    let gateHits = 0;

    // measure if we have ANY usable shoulder signal over time
    let prevShoulderY: number | null = null;
    let shoulderMotionHits = 0;

    for (const f of frames) {
        const side = pickBestSide(f.keypoints, MIN_KP_SCORE);
        if (!side) continue;

        const sy = shoulderYFromFrame(f.keypoints, side, MIN_KP_SCORE);
        const ea = elbowAngleFromFrame(f.keypoints, side, MIN_KP_SCORE);

        if (sy == null && ea == null) continue;
        usedFrames++;

        if (ea != null && ea > 60 && ea < 200) gateHits++;

        if (sy != null && prevShoulderY != null && Math.abs(sy - prevShoulderY) > 0.005) {
            shoulderMotionHits++;
        }
        if (sy != null) prevShoulderY = sy;
    }

    const isLikelyPushup = gateHits >= MIN_GATE_FRAMES || shoulderMotionHits >= MIN_GATE_FRAMES;

    if (!isLikelyPushup) {
        return {
            reps: 0,
            usedFrames,
            isLikelyPushup: false,
            feedback: { code: "NOT_PUSHUP", message: "Not a pushup posture / motion." },
            repFeedbacks: [],
            goodReps: 0,
            badReps: 0,
            debug: { gateHits, shoulderMotionHits },
        };
    }

    // -----------------------
    // PASS 2: detect rep attempts (always) + feedback
    // -----------------------
    type Phase = "UP" | "DOWN";
    let phase: Phase = "UP";

    const repFeedbacks: RepFeedback[] = [];
    let reps = 0;

    let repStartT: number | null = null;

    // tracking within a rep
    let topShoulderY: number | null = null;
    let bottomShoulderY: number | null = null;
    let torsoLen: number | null = null;

    let minElbowAngle: number | null = null;
    let minPlankAngle: number | null = null;

    let elbowSmoothed: number | null = null;

    let confidenceFrames = 0;
    let missingFrames = 0;

    let repSignal: "ELBOW" | "SHOULDER_Y" = "SHOULDER_Y";

    const resetRep = () => {
        repStartT = null;
        topShoulderY = null;
        bottomShoulderY = null;
        torsoLen = torsoLen; // keep smoothed torsoLen across reps
        minElbowAngle = null;
        minPlankAngle = null;
        elbowSmoothed = null;
        confidenceFrames = 0;
        missingFrames = 0;
        repSignal = "SHOULDER_Y";
    };

    const finalizeRep = (endT: number) => {
        if (repStartT == null) return;

        const duration = endT - repStartT;
        if (duration < ABS_MIN_REP_SECONDS || duration > ABS_MAX_REP_SECONDS) {
            return; // ignore glitch
        }

        const tlNow = torsoLen ?? 0;
        const travel = topShoulderY != null && bottomShoulderY != null ? bottomShoulderY - topShoulderY : 0;
        const travelFrac = tlNow > 0 ? travel / tlNow : Math.abs(travel); // if no torso, use raw travel magnitude

        reps++;

        const lowConfidence = confidenceFrames < 3 || missingFrames > MAX_MISSING_FRAMES_DURING_REP;

        const metrics = {
            duration,
            travel,
            travelFrac,
            minElbowAngle: minElbowAngle ?? 999,
            minPlankAngle: minPlankAngle ?? 999,
            confidenceFrames,
            missingFrames,
            signal: repSignal,
        };

        const graded = gradeRep({
            duration,
            travelFrac: metrics.travelFrac,
            minElbowAngle: metrics.minElbowAngle,
            minPlankAngle: metrics.minPlankAngle,
            lowConfidence,
        });

        const repInfo: RepFeedback = {
            repIndex: reps,
            tStart: repStartT,
            tEnd: endT,
            code: graded.code,
            message: graded.message,
            metrics,
        };

        repFeedbacks.push(repInfo);
        opts?.onRep?.(repInfo);
    };

    for (const f of frames) {
        const side = pickBestSide(f.keypoints, MIN_KP_SCORE);
        if (!side) {
            if (phase === "DOWN") {
                missingFrames++;
                if (missingFrames > MAX_MISSING_FRAMES_DURING_REP) {
                    phase = "UP";
                    resetRep();
                }
            }
            continue;
        }

        const elbowRaw = elbowAngleFromFrame(f.keypoints, side, MIN_KP_SCORE);
        const shoulderY = shoulderYFromFrame(f.keypoints, side, MIN_KP_SCORE);
        const yInfo = shoulderAndHipY(f.keypoints, side, MIN_KP_SCORE);
        const plankAng = hipPlankAngleFromFrame(f.keypoints, side, MIN_KP_SCORE);

        // torso length estimate (if hip available)
        if (yInfo) {
            const tl = dist(yInfo.shoulder, yInfo.hip);
            if (tl > 1) torsoLen = torsoLen == null ? tl : torsoLen * 0.9 + tl * 0.1;
        }

        // we need at least shoulderY to do anything
        if (shoulderY == null && elbowRaw == null) {
            if (phase === "DOWN") {
                missingFrames++;
                if (missingFrames > MAX_MISSING_FRAMES_DURING_REP) {
                    phase = "UP";
                    resetRep();
                }
            }
            continue;
        }

        confidenceFrames++;

        // smooth elbow if present
        const elbowAng = elbowRaw == null ? null : (elbowSmoothed = smooth(elbowSmoothed, elbowRaw, ELBOW_SMOOTH_ALPHA));

        // update quality metrics if available
        if (plankAng != null) minPlankAngle = minPlankAngle == null ? plankAng : Math.min(minPlankAngle, plankAng);
        if (elbowAng != null) minElbowAngle = minElbowAngle == null ? elbowAng : Math.min(minElbowAngle, elbowAng);

        // compute dynamic y thresholds based on torso length if possible
        const tlNow = torsoLen ?? 0;
        const startDownThresh = tlNow > 0 ? START_DOWN_FRACTION * tlNow : 0.015; // fallback if normalized coords
        const endUpThresh = tlNow > 0 ? END_UP_FRACTION * tlNow : 0.012;

        if (phase === "UP") {
            // track top shoulder (smallest y)
            if (shoulderY != null) {
                topShoulderY = topShoulderY == null ? shoulderY : Math.min(topShoulderY, shoulderY);
            }

            // start rep by elbow if possible
            const startByElbow = elbowAng != null && elbowAng < DOWN_ANGLE;

            // fallback start: shoulder moved down from the top
            const startByY =
                elbowAng == null &&
                shoulderY != null &&
                topShoulderY != null &&
                shoulderY - topShoulderY >= startDownThresh;

            if (startByElbow || startByY) {
                phase = "DOWN";
                repStartT = f.t;

                // set signal
                repSignal = startByElbow ? "ELBOW" : "SHOULDER_Y";

                // initialize bottom tracking
                bottomShoulderY = shoulderY ?? null;

                // reset per-rep counters
                confidenceFrames = 0;
                missingFrames = 0;
            }
        } else {
            // DOWN phase
            if (shoulderY != null) {
                bottomShoulderY = bottomShoulderY == null ? shoulderY : Math.max(bottomShoulderY, shoulderY);
            }

            const endByElbow = elbowAng != null && elbowAng > UP_ANGLE;

            // fallback end: shoulder moved back up from bottom
            const endByY =
                elbowAng == null &&
                shoulderY != null &&
                topShoulderY != null &&
                bottomShoulderY != null &&
                bottomShoulderY - shoulderY >= endUpThresh;

            if (endByElbow || endByY) {
                finalizeRep(f.t);
                phase = "UP";
                resetRep();
            }
        }
    }

    const goodReps = repFeedbacks.filter((r) => r.code === "GOOD").length;
    const badReps = repFeedbacks.length - goodReps;

    return {
        reps: repFeedbacks.length,
        usedFrames,
        isLikelyPushup: true,
        feedback:
            repFeedbacks.length === 0
                ? { code: "NO_REPS", message: "No reps detected." }
                : { code: "OK", message: `Detected reps.` },
        repFeedbacks,
        goodReps,
        badReps,
        debug: {
            usedFrames,
            params: {
                MIN_KP_SCORE,
                DOWN_ANGLE,
                UP_ANGLE,
                START_DOWN_FRACTION,
                END_UP_FRACTION,
                ABS_MIN_REP_SECONDS,
                ABS_MAX_REP_SECONDS,
                MAX_MISSING_FRAMES_DURING_REP,
            },
        },
    };
}
