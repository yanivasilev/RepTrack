import { ExerciseType } from "../common/exercises/ExerciseType";
import { WorkoutSetType } from "./WorkoutSetType";

export type WorkoutExerciseType = {
    id: string;
    exerciseId: string;
    name: string;
    exerciseType: ExerciseType;
    sets: WorkoutSetType[];
    notes?: string;
};
