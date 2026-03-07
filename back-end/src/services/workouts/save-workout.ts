import { ExerciseType } from "../../../generated/prisma/enums";
import { prisma } from "../../db";
import { SaveWorkoutType } from "../../schemas/workouts/save-workout/save-workout";
import { awardWorkoutBadges } from "../../utils/badges/awardWorkoutBadges";

export async function saveWorkoutService(userId: number, data: SaveWorkoutType) {

    const exerciseIds = [...new Set(data.exercises.map((e) => e.exerciseId))];

    const exercises = await prisma.exercise.findMany({
        where: { id: { in: exerciseIds } },
        select: { id: true, exerciseType: true },
    });

    const existingIds = new Set(exercises.map((e) => e.id));

    const missing = exerciseIds.filter((id) => !existingIds.has(id));

    // CHECKS IF EXERICSE EXISTS
    if (missing.length > 0) return { status: "invalid_exercise_id" as const, missing };

    const exerciseTypeById = new Map<number, ExerciseType>(
        exercises.map((e) => [e.id, e.exerciseType as ExerciseType])
    );

    const exerciseTypeErrors: Array<{
        exerciseId: number;
        exerciseIndex: number;
        setNumber: number;
        message: string;
    }> = [];

    // CHECKS IF EACH EXERCISE IS IN THE CORRECT FORMAT
    data.exercises.forEach((ex, exIndex) => {
        const type = exerciseTypeById.get(ex.exerciseId);

        if (!type) return;

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

    // RETURNS IF INVALID EXERCISE FORMAT IS FOUND
    if (exerciseTypeErrors.length > 0) return { status: "invalid_set_for_exercise_type" as const, errors: exerciseTypeErrors };

    // CREATES WORKOUT IN DB
    const workout = await prisma.workoutSession.create({
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

    // RUNS CHECK FOR NEW BADGES
    const newBadges = await awardWorkoutBadges(userId);

    return { workout, newBadges };
}
