import { prisma } from "../../../db";

export async function addSetService(userId: number, workoutExerciseId: number, data: {
    setNumber?: number; reps?: number; weight?: number; durationSeconds?: number;
    distanceMeters?: number; rpe?: number; isWarmup?: boolean; isFailure?: boolean
}) {
    return prisma.$transaction(async (tx) => {
        // CHECKS IF THE EXERCISE BELONGS TO THE USER
        const workoutExercise = await tx.workoutExercise.findUnique({
            where: { id: workoutExerciseId },
            select: {
                id: true,
                session: { select: { userId: true, endedAt: true } },
            },
        });

        if (!workoutExercise) return { status: "workout_exercise_not_found" as const };
        if (workoutExercise.session.userId !== userId) return { status: "unauthorised" as const };
        if (workoutExercise.session.endedAt !== null) return { status: "workout_not_active" as const };

        // DETERMINE SET NUMBER
        let setNumber = data.setNumber;
        if (setNumber === undefined) {
            const max = await tx.workoutSet.aggregate({
                where: { workoutExerciseId },
                _max: { setNumber: true },
            });
            setNumber = (max._max.setNumber ?? 0) + 1;
        }

        // CREATE SET
        try {
            const created = await tx.workoutSet.create({
                data: {
                    workoutExerciseId,
                    setNumber,
                    reps: data.reps,
                    weight: data.weight,
                    durationSeconds: data.durationSeconds,
                    distanceMeters: data.distanceMeters,
                    rpe: data.rpe,
                    isWarmup: data.isWarmup ?? false,
                    isFailure: data.isFailure ?? false,
                },
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
            });

            return { status: "ok" as const, set: created };
        } catch (error: any) {
            if (error?.code === "P2002") return { status: "set_number_taken" as const };
            throw error;
        }
    });
}
