import { prisma } from "../../db";

export async function startWorkoutService(userId: number, data: { startedAt?: string; notes?: string }) {

    // CHECK IF THERE IS AN ACTIVE WORKOUT
    const activeWorkout = await prisma.workoutSession.findFirst({
        where: { userId, endedAt: null },
        select: { id: true, startedAt: true },
    });

    if (activeWorkout) return { status: "active_workout_exists" as const };

    const workout = await prisma.workoutSession.create({
        data: {
            userId,
            startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
            notes: data.notes,
        },
        select: {
            id: true,
            startedAt: true,
            notes: true,
        },
    });

    return { status: "ok" as const, workout };
}
