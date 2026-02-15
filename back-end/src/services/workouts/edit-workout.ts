import { prisma } from "../../db";

export async function editWorkoutService(userId: number, workoutId: number, data: { startedAt?: string; endedAt?: string; notes?: string }) {
    const workout = await prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: { id: true, userId: true, startedAt: true, endedAt: true, notes: true },
    });

    if (!workout) return { status: "not_found" as const };
    if (workout.userId !== userId) return { status: "unauthorised" as const };

    const nextStartedAt = data.startedAt ? new Date(data.startedAt) : undefined;
    const nextEndedAt = data.endedAt ? new Date(data.endedAt) : undefined;
    const nextNotes = data.notes?.trim();

    // CHECK IF NO CHANGES DETECTED
    const noChange =
        (data.startedAt === undefined || nextStartedAt?.getTime() === workout.startedAt.getTime()) &&
        (data.endedAt === undefined || nextEndedAt?.getTime() === (workout.endedAt?.getTime() ?? NaN)) &&
        (data.notes === undefined || nextNotes === (workout.notes ?? ""));

    if (noChange) return { status: "no_changes" as const };

    // CHECK IF TIME IS VALID
    const s = nextStartedAt ?? workout.startedAt;
    const e = nextEndedAt ?? workout.endedAt ?? undefined;

    if (e && e < s) return { status: "invalid_time" as const };

    const updated = await prisma.workoutSession.update({
        where: { id: workoutId },
        data: {
            ...(nextStartedAt ? { startedAt: nextStartedAt } : {}),
            ...(data.endedAt !== undefined ? { endedAt: nextEndedAt ?? null } : {}),
            ...(data.notes !== undefined ? { notes: nextNotes } : {}),
        },
        select: { id: true, startedAt: true, endedAt: true, notes: true, updatedAt: true },
    });

    return { status: "ok" as const, workout: updated };
}
