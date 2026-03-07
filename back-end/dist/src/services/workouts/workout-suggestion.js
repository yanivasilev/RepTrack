"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutSuggestionService = workoutSuggestionService;
const db_1 = require("../../db");
const buildHistory_1 = require("../../utils/workout-suggestion/buildHistory");
const buildSuggestion_1 = require("../../utils/workout-suggestion/buildSuggestion");
const LOOKBACK_EXERCISE_SESSIONS = 3;
function toOneDecimal(value) {
    return Math.round(value * 10) / 10;
}
async function workoutSuggestionService(userId, opts) {
    // 1) Resolve exercise first so we can return a clean 404 if invalid.
    const exercise = await db_1.prisma.exercise.findUnique({
        where: { id: opts.exerciseId },
        select: {
            id: true,
            name: true,
            exerciseType: true,
        },
    });
    if (!exercise)
        return { status: "exercise_not_found" };
    // 2) Pull latest sessions for this user that include this specific exercise.
    const rows = await db_1.prisma.workoutSession.findMany({
        where: {
            userId,
            exercises: {
                some: { exerciseId: opts.exerciseId },
            },
        },
        orderBy: [{ startedAt: "desc" }, { id: "desc" }],
        take: LOOKBACK_EXERCISE_SESSIONS,
        select: {
            exercises: {
                where: { exerciseId: opts.exerciseId },
                select: {
                    sets: {
                        select: {
                            reps: true,
                            weight: true,
                            durationSeconds: true,
                        },
                    },
                },
            },
        },
    });
    const history = (0, buildHistory_1.buildHistory)(rows, toOneDecimal);
    if (history.length === 0) {
        return {
            status: "ok",
            suggestion: null,
        };
    }
    const suggestion = (0, buildSuggestion_1.buildSuggestion)(exercise.exerciseType, history, toOneDecimal);
    return { suggestion };
}
