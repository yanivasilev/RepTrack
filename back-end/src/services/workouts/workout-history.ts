import { prisma } from "../../db";

export async function workoutHistoryService(userId: number, opts: { page: number; limit: number; from?: string; to?: string; sort: "latest" | "oldest" }) {
    const { page, limit, from, to, sort } = opts;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (from || to) {
        where.startedAt = {};

        if (from) where.startedAt.gte = new Date(from);

        if (to) where.startedAt.lte = new Date(to);
    }

    const orderBy = { startedAt: sort === "latest" ? ("desc" as const) : ("asc" as const) };

    const [total, rows] = await Promise.all([
        prisma.workoutSession.count({ where }),
        prisma.workoutSession.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                startedAt: true,
                endedAt: true,
                notes: true,
                _count: {
                    select: {
                        exercises: true,
                    },
                },
                exercises: {
                    select: {
                        _count: { select: { sets: true } },
                    },
                },
            },
        }),
    ]);

    const items = rows.map((w) => {
        const totalSets = w.exercises.reduce((sum, ex) => sum + ex._count.sets, 0);
        const durationSeconds =
            w.endedAt ? Math.max(0, Math.floor((w.endedAt.getTime() - w.startedAt.getTime()) / 1000)) : null;

        return {
            id: w.id,
            startedAt: w.startedAt,
            endedAt: w.endedAt,
            notes: w.notes,
            exerciseCount: w._count.exercises,
            setCount: totalSets,
            durationSeconds,
        };
    });

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        items,
    };
}
