import { prisma } from "../../db";

export async function getAllProfilesService(page: number, limit: number, query?: string) {
    const skip = (page - 1) * limit;
    const where = query ? { username: { contains: query } } : {};

    // GETS PROFILES FROM DB
    const [total, rows] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            orderBy: { username: "asc" },
            skip,
            take: limit,
            select: {
                id: true,
                username: true,
                avatarFileName: true
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
