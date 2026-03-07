import { WorkoutDetailsExerciseType } from "./WorkoutDetailsExerciseType";

export type WorkoutDetailsType = {
    id: number;
    startedAt: string;
    durationSeconds: number;
    notes?: string;
    exercises: WorkoutDetailsExerciseType[];
};
