import { prisma } from "../../db";

export async function getWorkoutService(userId: number, workoutId: number) {
    const workout = await prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: {
            id: true,
            userId: true,
            startedAt: true,
            endedAt: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            exercises: {
                orderBy: { orderIndex: "asc" },
                select: {
                    id: true,
                    orderIndex: true,
                    notes: true,
                    exercise: { select: { id: true, name: true } },
                    sets: {
                        orderBy: { setNumber: "asc" },
                        select: {
                            id: true,
                            setNumber: true,
                            reps: true,
                            weight: true,
                            durationSeconds: true,
                            distanceMeters: true,
                            rpe: true,
                            isWarmup: true,
                            isFailure: true,
                        },
                    },
                },
            },
        },
    });

    if (!workout) return { status: "not_found" as const };
    if (workout.userId !== userId) return { status: "unauthorised" as const };

    // SUMMARISE WORKOUT DURATION
    const durationSeconds =
        workout.endedAt ? Math.max(0, Math.floor((workout.endedAt.getTime() - workout.startedAt.getTime()) / 1000)) : null;

    return {
        status: "ok" as const,
        workout: {
            ...workout,
            durationSeconds,
        },
    };
}
