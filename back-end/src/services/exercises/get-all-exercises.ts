import { prisma } from "../../db";

export async function getAllExercisesService(page: number, limit: number, query?: string) {
    const skip = (page - 1) * limit;
    const where = query ? { name: { contains: query } } : {};

    // GETS EXERCISE FROM THE DB
    const [total, rows] = await Promise.all([
        prisma.exercise.count({ where }),
        prisma.exercise.findMany({
            where,
            orderBy: { name: "asc" },
            skip,
            take: limit,
            select: {
                id: true,
                name: true,
                category: true,
                muscleGroup: true,
                equipment: true,
                isBodyweight: true,
                exerciseType: true,
                experienceLevel: true,
            },
        }),
    ]);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items: rows,
    };
}
