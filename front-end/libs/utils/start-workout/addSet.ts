import { nanoid } from "nanoid/non-secure";
import { WorkoutSetType } from "../../types/workouts/WorkoutSetType";
import { ExerciseType } from "../../types/common/exercises/ExerciseType";

export function addSet(exerciseType: ExerciseType): WorkoutSetType {
    return {
        id: nanoid(),
        ...(exerciseType === "REPS"
            ? { reps: undefined, weight: undefined }
            : { durationSeconds: undefined, weight: undefined }),
        notes: undefined
    };
}
