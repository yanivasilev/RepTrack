import { prisma } from "../../db";
import { addDays } from "../../utils/workout-stats/addDays";
import { addWeeks } from "../../utils/workout-stats/addWeeks";
import { buildDayPoints } from "../../utils/workout-stats/buildDayPoints";
import { buildWeekPoints } from "../../utils/workout-stats/buildWeekPoints";
import { indexPoints } from "../../utils/workout-stats/indexPoints";
import { startOfDay } from "../../utils/workout-stats/startOfDay";
import { startOfWeek } from "../../utils/workout-stats/startOfWeek";
import { bestStreak } from "../../utils/workout-stats/streaks/bestStreak";
import { currentStreak } from "../../utils/workout-stats/streaks/currentStreak";
import { dayKey } from "../../utils/workout-stats/dayKey";
import { Point } from "../../utils/workout-stats/types/Point";
import { Stats } from "../../utils/workout-stats/types/Stats";
import { ChartKitData } from "../../utils/workout-stats/types/ChartKitData";
import { ChartTimeFrame } from "../../utils/workout-stats/types/ChartTimeFrame";
import { Metric } from "../../utils/workout-stats/types/Metric";
import { StatsTimeFrame } from "../../utils/workout-stats/types/StatsTimeFrame";
import { emptyStats } from "../../utils/workout-stats/emptyStats";
import { toChartKitData } from "../../utils/workout-stats/toChartKitData";

export async function workoutStatsService(userId: number) {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);

    // START DATES FOR EACH PERIOD
    const from7d = addDays(todayStart, -6);
    const from30d = addDays(todayStart, -29);
    const from365d = addWeeks(weekStart, -(53 - 1));

    // CONVERTS DATES TO MILLISECONDS
    const t7 = from7d.getTime();
    const t30 = from30d.getTime();
    const t365 = from365d.getTime();

    const periodConfig: Record<ChartTimeFrame, { bucket: "day" | "week"; labelEvery: number; metricPoints: Record<Metric, Point[]>; metricIndex: Record<Metric, Map<string, number>> }> = {
        last7d: {
            bucket: "day",
            labelEvery: 1,
            metricPoints: {
                workouts: buildDayPoints(now, 7),
                durationSeconds: buildDayPoints(now, 7),
                volumeKg: buildDayPoints(now, 7),
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
                workouts: buildDayPoints(now, 30),
                durationSeconds: buildDayPoints(now, 30),
                volumeKg: buildDayPoints(now, 30),
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
                workouts: buildWeekPoints(weekStart, 53, 8),
                durationSeconds: buildWeekPoints(weekStart, 53, 8),
                volumeKg: buildWeekPoints(weekStart, 53, 8),
            },
            metricIndex: {
                workouts: new Map(),
                durationSeconds: new Map(),
                volumeKg: new Map(),
            },
        },
    };

    // MAPS METRICS INDEX
    (Object.keys(periodConfig) as ChartTimeFrame[]).forEach((period) => {
        (Object.keys(periodConfig[period].metricPoints) as Metric[]).forEach((metric) => {
            periodConfig[period].metricIndex[metric] = indexPoints(periodConfig[period].metricPoints[metric]);
        });
    });

    // GETS WORKOUT SESSIONS
    const sessions = await prisma.workoutSession.findMany({
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

    // GETS WEIGHT UNIT TYPE
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { weightUnitType: true },
    });

    const stats: Record<StatsTimeFrame, Stats> = {
        last7d: emptyStats(),
        last30d: emptyStats(),
        last365d: emptyStats(),
        allTime: emptyStats(),
    };

    for (const s of sessions) {
        // CHECKS WHICH TIME BUCKETS THIS WORKOUT FALLS TO
        const startedMs = s.startedAt.getTime();
        const in365 = startedMs >= t365;
        const in30 = startedMs >= t30;
        const in7 = startedMs >= t7;

        const trainingSeconds = Math.max(0, s.durationSeconds);

        // COUNTS EXERCISES
        const exerciseCount = s.exercises.length;

        // CALCULATES VOLUME
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

        // ADDS WORKOUT TO THE CORRECT TIME FRAME AND UPDATES DATA POINT FOR CHART KIT GRAPHS
        const addTo = (timeFrame: StatsTimeFrame) => {
            stats[timeFrame].workoutsCount += 1;
            stats[timeFrame].totalExercises += exerciseCount;
            stats[timeFrame].totalSets += setsCount;
            stats[timeFrame].trainingTimeSeconds += trainingSeconds;
            stats[timeFrame].totalReps += repsSum;
            stats[timeFrame].totalVolumeKg += volumeKgSum;

            if (timeFrame === "allTime") return;

            const cfg = periodConfig[timeFrame];
            const key = cfg.bucket === "day" ? dayKey(s.startedAt) : dayKey(startOfWeek(s.startedAt));

            const workoutsIdx = cfg.metricIndex.workouts.get(key);
            if (workoutsIdx !== undefined) cfg.metricPoints.workouts[workoutsIdx].value += 1;

            const durationIdx = cfg.metricIndex.durationSeconds.get(key);
            if (durationIdx !== undefined) cfg.metricPoints.durationSeconds[durationIdx].value += trainingSeconds;

            const volumeIdx = cfg.metricIndex.volumeKg.get(key);
            if (volumeIdx !== undefined) cfg.metricPoints.volumeKg[volumeIdx].value += volumeKgSum;
        };

        addTo("allTime");
        if (in365) addTo("last365d");
        if (in30) addTo("last30d");
        if (in7) addTo("last7d");
    }

    // CALCULATES STREAKS
    const workoutDayKeys = new Set(sessions.map((s) => dayKey(s.startedAt)));
    const currentStreakDays = currentStreak(workoutDayKeys, now);
    const bestStreakDays = bestStreak(workoutDayKeys);

    // CONVERTS THE DATA TO FORMAT 'REACT-NATIVE-CHART-KIT'
    const charts: Record<Metric, Record<ChartTimeFrame, ChartKitData>> = {
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
