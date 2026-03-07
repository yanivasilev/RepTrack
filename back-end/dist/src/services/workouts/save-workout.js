"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkoutService = saveWorkoutService;
const db_1 = require("../../db");
const awardWorkoutBadges_1 = require("../../utils/badges/awardWorkoutBadges");
async function saveWorkoutService(userId, data) {
    const exerciseIds = [...new Set(data.exercises.map((e) => e.exerciseId))];
    const exercises = await db_1.prisma.exercise.findMany({
        where: { id: { in: exerciseIds } },
        select: { id: true, exerciseType: true },
    });
    const existingIds = new Set(exercises.map((e) => e.id));
    const missing = exerciseIds.filter((id) => !existingIds.has(id));
    if (missing.length > 0)
        return { status: "invalid_exercise_id", missing };
    const exerciseTypeById = new Map(exercises.map((e) => [e.id, e.exerciseType]));
    const exerciseTypeErrors = [];
    data.exercises.forEach((ex, exIndex) => {
        const type = exerciseTypeById.get(ex.exerciseId);
        if (!type)
            return;
        ex.sets.forEach((set) => {
            if (type === "REPS") {
                if (set.durationSeconds !== undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "REPS exercise sets cannot include durationSeconds.",
                    });
                }
                if (set.reps === undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "REPS exercise sets must include reps.",
                    });
                }
                if (set.weight === undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "REPS exercise sets must include weight.",
                    });
                }
            }
            if (type === "TIMED") {
                if (set.reps !== undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "TIMED exercise sets cannot include reps.",
                    });
                }
                if (set.durationSeconds === undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "TIMED exercise sets must include durationSeconds.",
                    });
                }
                if (set.weight === undefined) {
                    exerciseTypeErrors.push({
                        exerciseId: ex.exerciseId,
                        exerciseIndex: exIndex,
                        setNumber: set.setNumber,
                        message: "TIMED exercise sets must include weight.",
                    });
                }
            }
        });
    });
    if (exerciseTypeErrors.length > 0) {
        return { status: "invalid_set_for_exercise_type", errors: exerciseTypeErrors };
    }
    const workout = await db_1.prisma.workoutSession.create({
        data: {
            userId,
            startedAt: new Date(data.startedAt),
            endedAt: new Date(data.endedAt),
            durationSeconds: data.durationSeconds,
            notes: data.notes,
            exercises: {
                create: data.exercises.map((exercise) => ({
                    exerciseId: exercise.exerciseId,
                    orderIndex: exercise.orderIndex,
                    notes: exercise.notes,
                    sets: {
                        create: exercise.sets.map((set) => ({
                            setNumber: set.setNumber,
                            reps: set.reps,
                            weight: set.weight,
                            durationSeconds: set.durationSeconds,
                            notes: set.notes
                        })),
                    },
                })),
            },
        },
        select: {
            id: true,
            startedAt: true,
            endedAt: true,
            durationSeconds: true,
        },
    });
    const newBadges = await (0, awardWorkoutBadges_1.awardWorkoutBadges)(userId);
    return { workout, newBadges };
}
