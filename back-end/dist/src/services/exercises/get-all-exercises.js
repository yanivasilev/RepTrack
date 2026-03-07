"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllExercisesService = getAllExercisesService;
const db_1 = require("../../db");
async function getAllExercisesService(page, limit, query) {
    const skip = (page - 1) * limit;
    const where = query ? { name: { contains: query } } : {};
    const [total, rows] = await Promise.all([
        db_1.prisma.exercise.count({ where }),
        db_1.prisma.exercise.findMany({
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
