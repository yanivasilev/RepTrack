export const CONFIG = {
    KEYPOINT: {
        MIN_SCORE: 0.35,
    },
    GATE: {
        MIN_HIT_FRAMES: 2,
        MIN_ELBOW_ANGLE_DEG: 60,
        MAX_ELBOW_ANGLE_DEG: 200,
        MIN_SHOULDER_DELTA: 0.005,
    },
    REP: {
        MIN_DURATION_SECONDS: 0.08,
        MAX_DURATION_SECONDS: 12.0,
        MIN_FRAMES: 2,
        MAX_MISSING_FRAMES: 6,
        START_COOLDOWN_SECONDS: 0.12,
        MIN_CONFIDENCE_FRAMES: 2,
    },
    ANGLE: {
        START_DROP_DEG: 8,
        END_RISE_DEG: 10,
        ABS_END_UP_ELBOW_DEG: 138,
    },
    MOTION: {
        START_DOWN_TORSO_FRACTION: 0.03,
        END_UP_TORSO_FRACTION: 0.03,
        FALLBACK_START_DOWN_DELTA: 0.01,
        FALLBACK_END_UP_DELTA: 0.008,
    },
    SMOOTHING: {
        ELBOW_ALPHA: 0.6,
    },
} as const;
