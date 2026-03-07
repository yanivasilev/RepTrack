import { Stats } from "./types/Stats";

export function emptyStats(): Stats {
    return {
        workoutsCount: 0,
        totalExercises: 0,
        totalSets: 0,
        trainingTimeSeconds: 0,
        totalVolumeKg: 0,
        totalReps: 0,
    };
}