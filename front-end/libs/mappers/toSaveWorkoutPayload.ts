import { SaveWorkoutExerciseType } from "../types/workouts/workout-start/SaveWorkoutExerciseType";
import { WorkoutExerciseType } from "../types/workouts/WorkoutExerciseType";

export function toSaveWorkoutPayload(state: { workoutStartedAtMs: number; exercises: WorkoutExerciseType[]; notes?: string }, finalMs: number) {
    return {
        startedAt: new Date(state.workoutStartedAtMs).toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: Math.floor(finalMs / 1000),
        notes: state.notes?.trim() || undefined,
        exercises: state.exercises.map<SaveWorkoutExerciseType>((exercise, exerciseIndex) => ({
            exerciseId: Number(exercise.exerciseId),
            exerciseType: exercise.exerciseType,
            orderIndex: exerciseIndex,
            notes: exercise.notes?.trim() || undefined,
            sets: exercise.sets.map((set, setIndex) => ({
                setNumber: setIndex + 1,
                reps: set.reps ?? undefined,
                weight: set.weight ?? undefined,
                durationSeconds: set.durationSeconds ?? undefined,
                notes: set.notes?.trim() || undefined,
            })),
        })),
    };
}
