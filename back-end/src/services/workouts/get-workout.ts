import { prisma } from "../../db";

export async function getWorkoutService(userId: number, workoutId: number) {
    const workout = await prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: {
            id: true,
            userId: true,
            startedAt: true,
            durationSeconds: true,
            notes: true,
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
                            notes: true
                        },
                    },
                },
            },
        },
    });

    // CHECKS IF WORKOUT EXISTS AND OWNER MATCHES
    if (!workout) return { status: "not_found" as const };
    if (workout.userId !== userId) return { status: "unauthorised" as const };

    // REMOVES USER ID
    const { userId: _ignored, ...safeWorkout } = workout;

    return {
        status: "ok" as const,
        workout: safeWorkout
    };
}
