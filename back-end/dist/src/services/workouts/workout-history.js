"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutHistoryService = workoutHistoryService;
const db_1 = require("../../db");
async function workoutHistoryService(userId, opts) {
    const { page, limit, from, to, sort } = opts;
    const skip = (page - 1) * limit;
    const where = { userId };
    if (from || to) {
        where.startedAt = {};
        if (from)
            where.startedAt.gte = new Date(from);
        if (to)
            where.startedAt.lte = new Date(to);
    }
    const orderBy = { startedAt: sort === "latest" ? "desc" : "asc" };
    const [total, rows] = await Promise.all([
        db_1.prisma.workoutSession.count({ where }),
        db_1.prisma.workoutSession.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                startedAt: true,
                durationSeconds: true,
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
        return {
            id: w.id,
            startedAt: w.startedAt,
            notes: w.notes,
            exerciseCount: w._count.exercises,
            setCount: totalSets,
            durationSeconds: w.durationSeconds,
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
