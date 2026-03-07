"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutStatsService = workoutStatsService;
const db_1 = require("../../db");
const addDays_1 = require("../../utils/workout-tracking-charts/addDays");
const addWeekts_1 = require("../../utils/workout-tracking-charts/addWeekts");
const buildDayPoints_1 = require("../../utils/workout-tracking-charts/buildDayPoints");
const buildWeekPoints_1 = require("../../utils/workout-tracking-charts/buildWeekPoints");
const indexPoints_1 = require("../../utils/workout-tracking-charts/indexPoints");
const is0DayKey_1 = require("../../utils/workout-tracking-charts/is0DayKey");
const startOfDay_1 = require("../../utils/workout-tracking-charts/startOfDay");
const startOfWeek_1 = require("../../utils/workout-tracking-charts/startOfWeek");
const bestStreak_1 = require("../../utils/workout-stats/bestStreak");
const currentStreak_1 = require("../../utils/workout-stats/currentStreak");
const dayKey_1 = require("../../utils/workout-stats/dayKey");
function emptyStats() {
    return {
        workoutsCount: 0,
        totalExercises: 0,
        totalSets: 0,
        trainingTimeSeconds: 0,
        totalVolumeKg: 0,
        totalReps: 0,
    };
}
function toChartKitData(points, labelEvery) {
    const labels = points.map((point, index) => {
        if (index % labelEvery !== 0)
            return "";
        return point.label;
    });
    return {
        labels,
        datasets: [{ data: points.map((point) => point.value) }],
    };
}
async function workoutStatsService(userId) {
    const now = new Date();
    const todayStart = (0, startOfDay_1.startOfDay)(now);
    const weekStart = (0, startOfWeek_1.startOfWeek)(now);
    const from7d = (0, addDays_1.addDays)(todayStart, -6);
    const from30d = (0, addDays_1.addDays)(todayStart, -29);
    const from365d = (0, addWeekts_1.addWeeks)(weekStart, -(53 - 1));
    const t7 = from7d.getTime();
    const t30 = from30d.getTime();
    const t365 = from365d.getTime();
    const periodConfig = {
        last7d: {
            bucket: "day",
            labelEvery: 1,
            metricPoints: {
                workouts: (0, buildDayPoints_1.buildDayPoints)(now, 7),
                durationSeconds: (0, buildDayPoints_1.buildDayPoints)(now, 7),
                volumeKg: (0, buildDayPoints_1.buildDayPoints)(now, 7),
            },
            metricIndex: {
                workouts: new Map(),
                durationSeconds: new Map(),
                volumeKg: new Map(),
            },
        },
        last30d: {
            bucket: "day",
            labelEvery: 5,
            metricPoints: {
                workouts: (0, buildDayPoints_1.buildDayPoints)(now, 30),
                durationSeconds: (0, buildDayPoints_1.buildDayPoints)(now, 30),
                volumeKg: (0, buildDayPoints_1.buildDayPoints)(now, 30),
            },
            metricIndex: {
                workouts: new Map(),
                durationSeconds: new Map(),
                volumeKg: new Map(),
            },
        },
        last365d: {
            bucket: "week",
            labelEvery: 1,
            metricPoints: {
                workouts: (0, buildWeekPoints_1.buildWeekPoints)(weekStart, 53, 8),
                durationSeconds: (0, buildWeekPoints_1.buildWeekPoints)(weekStart, 53, 8),
                volumeKg: (0, buildWeekPoints_1.buildWeekPoints)(weekStart, 53, 8),
            },
            metricIndex: {
                workouts: new Map(),
                durationSeconds: new Map(),
                volumeKg: new Map(),
            },
        },
    };
    Object.keys(periodConfig).forEach((period) => {
        Object.keys(periodConfig[period].metricPoints).forEach((metric) => {
            periodConfig[period].metricIndex[metric] = (0, indexPoints_1.indexPoints)(periodConfig[period].metricPoints[metric]);
        });
    });
    const sessions = await db_1.prisma.workoutSession.findMany({
        where: {
            userId,
        },
        select: {
            startedAt: true,
            durationSeconds: true,
            exercises: {
                select: {
                    id: true,
                    sets: {
                        select: {
                            reps: true,
                            weight: true,
                        },
                    },
                },
            },
        },
    });
    const user = await db_1.prisma.user.findUnique({
        where: { id: userId },
        select: { weightUnitType: true },
    });
    const stats = {
        last7d: emptyStats(),
        last30d: emptyStats(),
        last365d: emptyStats(),
        allTime: emptyStats(),
    };
    for (const s of sessions) {
        const startedMs = s.startedAt.getTime();
        const in365 = startedMs >= t365;
        const in30 = startedMs >= t30;
        const in7 = startedMs >= t7;
        const trainingSeconds = Math.max(0, s.durationSeconds);
        // COUNT EXERCISES
        const exerciseCount = s.exercises.length;
        let setsCount = 0;
        let repsSum = 0;
        let volumeKgSum = 0;
        for (const ex of s.exercises) {
            for (const set of ex.sets) {
                setsCount += 1;
                if (typeof set.reps === "number") {
                    repsSum += set.reps;
                    if (typeof set.weight === "number") {
                        volumeKgSum += set.weight * set.reps;
                    }
                }
            }
        }
        const addTo = (timeFrame) => {
            stats[timeFrame].workoutsCount += 1;
            stats[timeFrame].totalExercises += exerciseCount;
            stats[timeFrame].totalSets += setsCount;
            stats[timeFrame].trainingTimeSeconds += trainingSeconds;
            stats[timeFrame].totalReps += repsSum;
            stats[timeFrame].totalVolumeKg += volumeKgSum;
            if (timeFrame === "allTime")
                return;
            const cfg = periodConfig[timeFrame];
            const key = cfg.bucket === "day" ? (0, is0DayKey_1.is0DayKey)(s.startedAt) : (0, is0DayKey_1.is0DayKey)((0, startOfWeek_1.startOfWeek)(s.startedAt));
            const workoutsIdx = cfg.metricIndex.workouts.get(key);
            if (workoutsIdx !== undefined)
                cfg.metricPoints.workouts[workoutsIdx].value += 1;
            const durationIdx = cfg.metricIndex.durationSeconds.get(key);
            if (durationIdx !== undefined)
                cfg.metricPoints.durationSeconds[durationIdx].value += trainingSeconds;
            const volumeIdx = cfg.metricIndex.volumeKg.get(key);
            if (volumeIdx !== undefined)
                cfg.metricPoints.volumeKg[volumeIdx].value += volumeKgSum;
        };
        addTo("allTime");
        if (in365)
            addTo("last365d");
        if (in30)
            addTo("last30d");
        if (in7)
            addTo("last7d");
    }
    const workoutDayKeys = new Set(sessions.map((s) => (0, dayKey_1.dayKey)(s.startedAt)));
    const currentStreakDays = (0, currentStreak_1.currentStreak)(workoutDayKeys, now);
    const bestStreakDays = (0, bestStreak_1.bestStreak)(workoutDayKeys);
    const charts = {
        workouts: {
            last7d: toChartKitData(periodConfig.last7d.metricPoints.workouts, periodConfig.last7d.labelEvery),
            last30d: toChartKitData(periodConfig.last30d.metricPoints.workouts, periodConfig.last30d.labelEvery),
            last365d: toChartKitData(periodConfig.last365d.metricPoints.workouts, periodConfig.last365d.labelEvery),
        },
        durationSeconds: {
            last7d: toChartKitData(periodConfig.last7d.metricPoints.durationSeconds, periodConfig.last7d.labelEvery),
            last30d: toChartKitData(periodConfig.last30d.metricPoints.durationSeconds, periodConfig.last30d.labelEvery),
            last365d: toChartKitData(periodConfig.last365d.metricPoints.durationSeconds, periodConfig.last365d.labelEvery),
        },
        volumeKg: {
            last7d: toChartKitData(periodConfig.last7d.metricPoints.volumeKg, periodConfig.last7d.labelEvery),
            last30d: toChartKitData(periodConfig.last30d.metricPoints.volumeKg, periodConfig.last30d.labelEvery),
            last365d: toChartKitData(periodConfig.last365d.metricPoints.volumeKg, periodConfig.last365d.labelEvery),
        },
    };
    return {
        ...stats,
        streaks: {
            currentStreakDays,
            bestStreakDays,
        },
        charts,
        user: {
            weightUnitType: user?.weightUnitType ?? "METRIC",
        },
    };
}
