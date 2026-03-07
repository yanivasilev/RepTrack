"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkoutService = getWorkoutService;
const db_1 = require("../../db");
async function getWorkoutService(userId, workoutId) {
    const workout = await db_1.prisma.workoutSession.findUnique({
        where: { id: workoutId },
        select: {
            id: true,
            userId: true,
            startedAt: true,
            durationSeconds: true,
            notes: true,
            exercises: {
                orderBy: { orderIndex: "asc" },
                select: {
                    id: true,
                    orderIndex: true,
                    notes: true,
                    exercise: { select: { id: true, name: true } },
                    sets: {
                        orderBy: { setNumber: "asc" },
                        select: {
                            id: true,
                            setNumber: true,
                            reps: true,
                            weight: true,
                            durationSeconds: true,
                            notes: true
                        },
                    },
                },
            },
        },
    });
    if (!workout)
        return { status: "not_found" };
    if (workout.userId !== userId)
        return { status: "unauthorised" };
    const { userId: _ignored, ...safeWorkout } = workout;
    return {
        status: "ok",
        workout: safeWorkout
    };
}
