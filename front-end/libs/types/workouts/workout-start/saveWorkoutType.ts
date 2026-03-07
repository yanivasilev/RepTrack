import { SaveWorkoutExerciseType } from "./SaveWorkoutExerciseType";

export type SaveWorkoutType = {
    startedAt: string;
    endedAt: string;
    durationSeconds: number;
    notes?: string;
    exercises: SaveWorkoutExerciseType[];
}