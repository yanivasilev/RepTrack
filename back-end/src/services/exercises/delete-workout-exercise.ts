import { prisma } from "../../db";

export async function deleteWorkoutExerciseService(userId: number, workoutExerciseId: number) {
    const workoutExercise = await prisma.workoutExercise.findUnique({
        where: { id: workoutExerciseId },
        select: { id: true, session: { select: { userId: true, endedAt: true } } },
    });

    if (!workoutExercise) return { status: "not_found" as const };
    if (workoutExercise.session.userId !== userId) return { status: "unauthorised" as const };
    if (workoutExercise.session.endedAt !== null) return { status: "workout_not_active" as const };

    await prisma.workoutExercise.delete({ where: { id: workoutExerciseId }, });

    return { status: "ok" as const };
}
