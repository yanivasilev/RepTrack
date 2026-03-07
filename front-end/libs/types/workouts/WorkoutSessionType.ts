import { WorkoutExerciseType } from "./WorkoutExerciseType";

export type WorkoutSessionType = {
    status: "running" | "paused";
    workoutStartedAtMs: number;
    runningSinceMs: number;
    accumulatedMs: number;
    notes?: string;
    exercises: WorkoutExerciseType[];
};
