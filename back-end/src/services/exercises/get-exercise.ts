import { prisma } from "../../db";

export async function getExerciseService(exerciseId: number) {
    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        select: {
            id: true,
            name: true,
            category: true,
            muscleGroup: true,
            equipment: true,
            isBodyweight: true,
            createdAt: true,
        },
    });

    if (!exercise) return { status: "not_found" as const };

    return { status: "ok" as const, exercise };
}
