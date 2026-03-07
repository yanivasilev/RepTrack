import { prisma } from "../../db";

export async function getExerciseService(exerciseId: number) {
    // GETS EXERCISE FROM DB
    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
        select: {
            id: true,
            name: true,
            category: true,
            muscleGroup: true,
            equipment: true,
            isBodyweight: true,
            exerciseType: true,
            createdAt: true,
        },
    });

    // CHECKS IF EXERCISE EXISTS
    if (!exercise) return { status: "not_found" as const };

    return { exercise };
}
