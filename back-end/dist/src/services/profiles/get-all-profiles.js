"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfilesService = getAllProfilesService;
const db_1 = require("../../db");
async function getAllProfilesService(page, limit, query) {
    const skip = (page - 1) * limit;
    const where = query ? { username: { contains: query } } : {};
    const [total, rows] = await Promise.all([
        db_1.prisma.user.count({ where }),
        db_1.prisma.user.findMany({
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
