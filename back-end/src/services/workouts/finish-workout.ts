import { prisma } from "../../db";

export async function finishWorkoutService(userId: number, workoutId: number, data: { endedAt?: string; notes?: string }) {
    const workout = await prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: { id: true, userId: true, endedAt: true, startedAt: true, notes: true },
    });

    if (!workout) return { status: "not_found" as const };
    if (workout.userId !== userId) return { status: "unauthorised" as const };

    // CHECK IF ALREADY FINISHED
    if (workout.endedAt) return { status: "already_finished" as const };

    const endedAt = data.endedAt ? new Date(data.endedAt) : new Date();

    // CHECK IF TIME IS VALID
    if (endedAt < workout.startedAt) return { status: "invalid_time" as const };

    const updated = await prisma.workoutSession.update({
        where: { id: workoutId },
        data: {
            endedAt,
            ...(data.notes !== undefined ? { notes: data.notes } : {}),
        },
        select: { id: true, startedAt: true, endedAt: true, notes: true, updatedAt: true },
    });

    return { status: "ok" as const, workout: updated };
}
