import { prisma } from "../../db";

export async function updateWorkoutExerciseService(userId: number, workoutExerciseId: number, data: { exerciseId?: number; orderIndex?: number; notes?: string }) {
    return prisma.$transaction(async (tx) => {

        // FIND EXERCISE AND OWNER
        const workoutExercise = await tx.workoutExercise.findUnique({
            where: { id: workoutExerciseId },
            select: {
                id: true,
                sessionId: true,
                exerciseId: true,
                orderIndex: true,
                notes: true,
                session: { select: { userId: true, endedAt: true } },
            },
        });

        if (!workoutExercise) return { status: "not_found" as const };
        if (workoutExercise.session.userId !== userId) return { status: "unauthorised" as const };
        if (workoutExercise.session.endedAt !== null) return { status: "workout_not_active" as const };

        // IF CHANGING EXERCISE ID CONFIRM IT EXISTS
        if (data.exerciseId !== undefined && data.exerciseId !== workoutExercise.exerciseId) {
            const ex = await tx.exercise.findUnique({
                where: { id: data.exerciseId },
                select: { id: true },
            });
            if (!ex) return { status: "exercise_not_found" as const };
        }

        // CHECK FOR NO CHANGES DETECTED
        const nextNotes = data.notes?.trim();
        const noChange =
            (data.exerciseId === undefined || data.exerciseId === workoutExercise.exerciseId) &&
            (data.orderIndex === undefined || data.orderIndex === workoutExercise.orderIndex) &&
            (data.notes === undefined || nextNotes === (workoutExercise.notes ?? ""));

        if (noChange) return { status: "no_changes" as const };

        const updated = await tx.workoutExercise.update({
            where: { id: workoutExerciseId },
            data: {
                ...(data.exerciseId !== undefined ? { exerciseId: data.exerciseId } : {}),
                ...(data.orderIndex !== undefined ? { orderIndex: data.orderIndex } : {}),
                ...(data.notes !== undefined ? { notes: nextNotes } : {}),
            },
            select: {
                id: true,
                orderIndex: true,
                notes: true,
                exercise: { select: { id: true, name: true } },
            },
        });

        return { status: "ok" as const, workoutExercise: updated };
    });
}
