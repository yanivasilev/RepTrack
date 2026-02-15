import { prisma } from "../../db";

export async function deleteWorkoutService(userId: number, workoutId: number) {
    const workout = await prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: { userId: true },
    });

    if (!workout) return { status: "not_found" as const };
    if (workout.userId !== userId) return { status: "unauthorised" as const };

    await prisma.workoutSession.delete({ where: { id: workoutId }, });

    return { status: "ok" as const };
}
