import { nanoid } from "nanoid/non-secure";
import { WorkoutExerciseType } from "../../types/workouts/WorkoutExerciseType";
import { addSet } from "./addSet";
import { ExerciseType } from "../../types/common/exercises/ExerciseType";

export function addExercise(exerciseId: string, name: string, exerciseType: ExerciseType): WorkoutExerciseType {
    return {
        id: nanoid(),
        exerciseId,
        name,
        exerciseType,
        sets: [addSet(exerciseType)],
        notes: undefined
    };
}
