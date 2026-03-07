"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExerciseService = getExerciseService;
const db_1 = require("../../db");
async function getExerciseService(exerciseId) {
    const exercise = await db_1.prisma.exercise.findUnique({
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
    if (!exercise)
        return { status: "not_found" };
    return { status: "ok", exercise };
}
