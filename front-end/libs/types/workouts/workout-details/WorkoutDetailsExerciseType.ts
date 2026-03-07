import { WorkoutDetailsSetType } from "./WorkoutDetailsSetType";

export type WorkoutDetailsExerciseType = {
    id: number;
    orderIndex: number;
    notes?: string | null;
    exercise: {
        id: number;
        name: string;
    };
    sets: WorkoutDetailsSetType[];
};
