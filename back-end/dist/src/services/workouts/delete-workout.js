"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkoutService = deleteWorkoutService;
const db_1 = require("../../db");
async function deleteWorkoutService(userId, workoutId) {
    const workout = await db_1.prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: { userId: true },
    });
    if (!workout)
        return { status: "not_found" };
    if (workout.userId !== userId)
        return { status: "unauthorised" };
    await db_1.prisma.workoutSession.delete({ where: { id: workoutId }, });
    return { status: "ok" };
}
