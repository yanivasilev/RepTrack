import { prisma } from "../../db";
import { currentStreak } from "../workout-stats/streaks/currentStreak";
import { dayKey } from "../workout-stats/dayKey";

export type BadgeMetrics = {
    workoutsCount: number;
    totalDurationSeconds: number;
    currentStreakDays: number;
    totalVolume: number;
};

export async function getBadgeMetrics(userId: number): Promise<BadgeMetrics> {
    // GET USER WORKOUT SESSIONS AND SETS
    const [sessions, sets] = await Promise.all([
        prisma.workoutSession.findMany({
            where: { userId },
            select: {
                startedAt: true,
                durationSeconds: true,
            },
        }),
        prisma.workoutSet.findMany({
            where: { workoutExercise: { session: { userId } } },
            select: {
                reps: true,
                weight: true,
            },
        }),
    ]);

    // TOTAL NO. OF WORKOUTS
    const workoutsCount = sessions.length;

    // TOTAL NO. OF DURATION IN WORKOUTS
    const totalDurationSeconds = sessions.reduce((sum, session) => sum + Math.max(0, session.durationSeconds), 0);

    // CURRENT WORKOUT STREAK
    const dayKeys = new Set(sessions.map((session) => dayKey(session.startedAt)));
    const currentStreakDays = currentStreak(dayKeys);

    // TOTAL VOLUME
    const totalVolume = sets.reduce((sum, set) => {
        if (typeof set.reps !== "number") return sum;
        if (typeof set.weight !== "number") return sum;
        return sum + (set.reps * set.weight);
    }, 0);

    return {
        workoutsCount,
        totalDurationSeconds,
        currentStreakDays,
        totalVolume,
    };
}