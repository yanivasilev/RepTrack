import { prisma } from "../../db";

export async function getAllExercisesService(opts: { page: number; limit: number; query?: string; }) {
    const { page, limit, query } = opts;
    const skip = (page - 1) * limit;

    const where = query ? { name: { contains: query, lte: "insensitive" as const } } : {};

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
                createdAt: true,
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
