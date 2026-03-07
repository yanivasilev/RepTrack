"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBadgeMetrics = getBadgeMetrics;
const db_1 = require("../../db");
const currentStreak_1 = require("../workout-stats/currentStreak");
const dayKey_1 = require("../workout-stats/dayKey");
async function getBadgeMetrics(userId) {
    const [sessions, sets] = await Promise.all([
        db_1.prisma.workoutSession.findMany({
            where: { userId },
            select: {
                startedAt: true,
                durationSeconds: true,
            },
        }),
        db_1.prisma.workoutSet.findMany({
            where: { workoutExercise: { session: { userId } } },
            select: {
                reps: true,
                weight: true,
            },
        }),
    ]);
    const workoutsCount = sessions.length;
    const totalDurationSeconds = sessions.reduce((sum, session) => sum + Math.max(0, session.durationSeconds), 0);
    const dayKeys = new Set(sessions.map((session) => (0, dayKey_1.dayKey)(session.startedAt)));
    const currentStreakDays = (0, currentStreak_1.currentStreak)(dayKeys);
    const totalVolume = sets.reduce((sum, set) => {
        if (typeof set.reps !== "number")
            return sum;
        if (typeof set.weight !== "number")
            return sum;
        return sum + (set.reps * set.weight);
    }, 0);
    return {
        workoutsCount,
        totalDurationSeconds,
        currentStreakDays,
        totalVolume,
    };
}
