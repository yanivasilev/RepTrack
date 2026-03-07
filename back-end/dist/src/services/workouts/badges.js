"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awardWorkoutBadgesForUser = awardWorkoutBadgesForUser;
const enums_1 = require("../../../generated/prisma/enums");
const db_1 = require("../../db");
const currentStreak_1 = require("../../utils/workout-stats/currentStreak");
const dayKey_1 = require("../../utils/workout-stats/dayKey");
const WORKOUT_THRESHOLDS = [
    { type: enums_1.BadgeType.FIRST_WORKOUT, min: 1 },
    { type: enums_1.BadgeType.WORKOUTS_5, min: 5 },
    { type: enums_1.BadgeType.WORKOUTS_15, min: 15 },
    { type: enums_1.BadgeType.WORKOUTS_20, min: 20 },
    { type: enums_1.BadgeType.WORKOUTS_25, min: 25 },
    { type: enums_1.BadgeType.WORKOUTS_50, min: 50 },
    { type: enums_1.BadgeType.WORKOUTS_75, min: 75 },
    { type: enums_1.BadgeType.WORKOUTS_100, min: 100 },
    { type: enums_1.BadgeType.WORKOUTS_150, min: 150 },
    { type: enums_1.BadgeType.WORKOUTS_200, min: 200 },
    { type: enums_1.BadgeType.WORKOUTS_300, min: 300 },
    { type: enums_1.BadgeType.WORKOUTS_400, min: 400 },
    { type: enums_1.BadgeType.WORKOUTS_500, min: 500 },
    { type: enums_1.BadgeType.WORKOUTS_600, min: 600 },
    { type: enums_1.BadgeType.WORKOUTS_750, min: 750 },
    { type: enums_1.BadgeType.WORKOUTS_1000, min: 1000 },
];
const TOTAL_HOURS_THRESHOLDS = [
    { type: enums_1.BadgeType.TOTAL_5_HOURS, minHours: 5 },
    { type: enums_1.BadgeType.TOTAL_10_HOURS, minHours: 10 },
    { type: enums_1.BadgeType.TOTAL_15_HOURS, minHours: 15 },
    { type: enums_1.BadgeType.TOTAL_20_HOURS, minHours: 20 },
    { type: enums_1.BadgeType.TOTAL_25_HOURS, minHours: 25 },
    { type: enums_1.BadgeType.TOTAL_50_HOURS, minHours: 50 },
    { type: enums_1.BadgeType.TOTAL_75_HOURS, minHours: 75 },
    { type: enums_1.BadgeType.TOTAL_100_HOURS, minHours: 100 },
    { type: enums_1.BadgeType.TOTAL_150_HOURS, minHours: 150 },
    { type: enums_1.BadgeType.TOTAL_200_HOURS, minHours: 200 },
    { type: enums_1.BadgeType.TOTAL_300_HOURS, minHours: 300 },
    { type: enums_1.BadgeType.TOTAL_500_HOURS, minHours: 500 },
    { type: enums_1.BadgeType.TOTAL_1000_HOURS, minHours: 1000 },
];
const STREAK_THRESHOLDS = [
    { type: enums_1.BadgeType.STREAK_2, min: 2 },
    { type: enums_1.BadgeType.STREAK_3, min: 3 },
    { type: enums_1.BadgeType.STREAK_7, min: 7 },
];
const VOLUME_THRESHOLDS = [
    { type: enums_1.BadgeType.VOLUME_1000, min: 1000 },
    { type: enums_1.BadgeType.VOLUME_5000, min: 5000 },
    { type: enums_1.BadgeType.VOLUME_10K, min: 10000 },
    { type: enums_1.BadgeType.VOLUME_25k, min: 25000 },
    { type: enums_1.BadgeType.VOLUME_50k, min: 50000 },
    { type: enums_1.BadgeType.VOLUME_75k, min: 75000 },
    { type: enums_1.BadgeType.VOLUME_100k, min: 100000 },
    { type: enums_1.BadgeType.VOLUME_250k, min: 250000 },
    { type: enums_1.BadgeType.VOLUME_500k, min: 500000 },
    { type: enums_1.BadgeType.VOLUME_1M, min: 1000000 },
];
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
function resolveBadgeTypes(metrics) {
    const result = new Set();
    for (const threshold of WORKOUT_THRESHOLDS) {
        if (metrics.workoutsCount >= threshold.min)
            result.add(threshold.type);
    }
    for (const threshold of TOTAL_HOURS_THRESHOLDS) {
        if (metrics.totalDurationSeconds >= (threshold.minHours * 60 * 60))
            result.add(threshold.type);
    }
    for (const threshold of STREAK_THRESHOLDS) {
        if (metrics.currentStreakDays >= threshold.min)
            result.add(threshold.type);
    }
    for (const threshold of VOLUME_THRESHOLDS) {
        if (metrics.totalVolume >= threshold.min)
            result.add(threshold.type);
    }
    return [...result];
}
async function awardWorkoutBadgesForUser(userId) {
    const metrics = await getBadgeMetrics(userId);
    const targetTypes = resolveBadgeTypes(metrics);
    if (targetTypes.length === 0)
        return [];
    const alreadyEarnedRows = await db_1.prisma.userBadge.findMany({
        where: {
            userId,
            badge: { type: { in: targetTypes } },
        },
        select: {
            badge: { select: { type: true } },
        },
    });
    const alreadyEarned = new Set(alreadyEarnedRows.map((row) => row.badge.type));
    const missingTypes = targetTypes.filter((type) => !alreadyEarned.has(type));
    if (missingTypes.length === 0)
        return [];
    const badges = await db_1.prisma.badge.findMany({
        where: { type: { in: missingTypes } },
        select: {
            id: true,
            type: true,
            name: true,
            icon: true,
        },
    });
    if (badges.length === 0)
        return [];
    for (const badge of badges) {
        await db_1.prisma.userBadge.upsert({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id,
                },
            },
            update: {},
            create: {
                userId,
                badgeId: badge.id,
            },
        });
    }
    return badges.map((badge) => ({
        type: badge.type,
        name: badge.name,
        icon: badge.icon,
    }));
}
