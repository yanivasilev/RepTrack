import { ExerciseType } from "../../common/exercises/ExerciseType";
import { SaveWorkoutSetType } from "./SaveWorkoutSetType";

export type SaveWorkoutExerciseType = {
    exerciseId: number;
    orderIndex: number;
    exerciseType: ExerciseType;
    notes?: string;
    sets: SaveWorkoutSetType[];
};
