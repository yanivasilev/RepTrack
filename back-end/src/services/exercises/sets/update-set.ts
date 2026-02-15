import { prisma } from "../../../db";
import { addSetSchema } from "../../../schemas/exercises/sets/add-set";

export async function updateSetService(userId: number, setId: number, data: {
    setNumber?: number; reps?: number; weight?: number; durationSeconds?: number;
    distanceMeters?: number; rpe?: number; isWarmup?: boolean; isFailure?: boolean;
}) {
    return prisma.$transaction(async (tx) => {
        const set = await tx.workoutSet.findUnique({
            where: { id: setId },
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
                workoutExercise: { select: { session: { select: { userId: true, endedAt: true } } } },
            },
        });

        if (!set) return { status: "not_found" as const };
        if (set.workoutExercise.session.userId !== userId) return { status: "unauthorised" as const };
        if (set.workoutExercise.session.endedAt !== null) return { status: "workout_not_active" as const };

        // CHECK IF THERE ARE CHANGES
        const noChange =
            (data.setNumber === undefined || data.setNumber === set.setNumber) &&
            (data.reps === undefined || data.reps === set.reps) &&
            (data.weight === undefined || data.weight === set.weight) &&
            (data.durationSeconds === undefined || data.durationSeconds === set.durationSeconds) &&
            (data.distanceMeters === undefined || data.distanceMeters === set.distanceMeters) &&
            (data.rpe === undefined || data.rpe === set.rpe) &&
            (data.isWarmup === undefined || data.isWarmup === set.isWarmup) &&
            (data.isFailure === undefined || data.isFailure === set.isFailure);

        if (noChange) return { status: "no_changes" as const };

        const merged = {
            setNumber: data.setNumber ?? set.setNumber,
            reps: data.reps ?? set.reps,
            weight: data.weight ?? set.weight ?? (set.durationSeconds ?? undefined),
            durationSeconds: data.durationSeconds ?? (set.durationSeconds ?? undefined),
            distanceMeters: data.distanceMeters ?? (set.distanceMeters ?? undefined),
            rpe: data.rpe ?? (set.rpe ?? undefined),
            isWarmup: data.isWarmup ?? set.isWarmup,
            isFailure: data.isFailure ?? set.isFailure,
        };

        const valid = addSetSchema.safeParse(merged);

        if (!valid.success) return { status: "invalid_set" as const, errors: valid.error.issues };

        try {
            const updated = await tx.workoutSet.update({
                where: { id: setId },
                data: {
                    ...(data.setNumber !== undefined ? { setNumber: data.setNumber } : {}),
                    ...(data.reps !== undefined ? { reps: data.reps } : {}),
                    ...(data.weight !== undefined ? { weight: data.weight } : {}),
                    ...(data.durationSeconds !== undefined ? { durationSeconds: data.durationSeconds } : {}),
                    ...(data.distanceMeters !== undefined ? { distanceMeters: data.distanceMeters } : {}),
                    ...(data.rpe !== undefined ? { rpe: data.rpe } : {}),
                    ...(data.isWarmup !== undefined ? { isWarmup: data.isWarmup } : {}),
                    ...(data.isFailure !== undefined ? { isFailure: data.isFailure } : {}),
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

            return { status: "ok" as const, set: updated };
        } catch (error: any) {
            if (error?.code === "P2002") return { status: "set_number_taken" as const };
            throw error;
        }
    });
}