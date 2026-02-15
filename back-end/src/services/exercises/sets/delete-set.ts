import { prisma } from "../../../db";

export async function deleteSetService(userId: number, setId: number) {
    const set = await prisma.workoutSet.findUnique({
        where: { id: setId },
        select: {
            id: true,
            workoutExercise: { select: { session: { select: { userId: true, endedAt: true } } } },
        },
    });

    if (!set) return { status: "not_found" as const };
    if (set.workoutExercise.session.userId !== userId) return { status: "unauthorised" as const };
    if (set.workoutExercise.session.endedAt !== null) return { status: "workout_not_active" as const };

    await prisma.workoutSet.delete({ where: { id: setId } });

    return { status: "ok" as const };
}
