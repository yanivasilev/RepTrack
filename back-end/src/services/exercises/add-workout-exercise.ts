import { prisma } from "../../db";

export async function addWorkoutExerciseService(userId: number, workoutId: number, data: { exerciseId: number; orderIndex?: number; notes?: string }) {
    return prisma.$transaction(async (tx) => {
        // CHECKS IF WORKOUT BELONGS TO USER
        const workout = await tx.workoutSession.findUnique({
            where: { id: workoutId },
            select: { id: true, userId: true, endedAt: true },
        });

        if (!workout) return { status: "workout_not_found" as const };
        if (workout.userId !== userId) return { status: "unauthorised" as const };

        // CHECKS IF WORKOUT IS ACTIVE
        if (workout.endedAt !== null) return { status: "workout_not_active" as const };

        // CHECKS IF WORKOUT EXISTS IN CATALOG
        const exercise = await tx.exercise.findUnique({
            where: { id: data.exerciseId },
            select: { id: true, name: true },
        });

        if (!exercise) return { status: "exercise_not_found" as const };

        // ORDER INDEX
        let orderIndex = data.orderIndex;
        if (orderIndex === undefined) {
            const last = await tx.workoutExercise.aggregate({
                where: { sessionId: workoutId },
                _max: { orderIndex: true },
            });
            orderIndex = (last._max.orderIndex ?? -1) + 1;
        }

        const created = await tx.workoutExercise.create({
            data: {
                sessionId: workoutId,
                exerciseId: data.exerciseId,
                orderIndex,
                notes: data.notes,
            },
            select: {
                id: true,
                orderIndex: true,
                notes: true,
                exercise: { select: { id: true, name: true } },
            },
        });

        return { status: "ok" as const, workoutExercise: created };
    });
}
