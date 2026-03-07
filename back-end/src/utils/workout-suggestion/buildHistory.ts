export function buildHistory(rows: Array<{ exercises: Array<{ sets: Array<{ reps: number | null; weight: number | null; durationSeconds: number | null }>; }>; }>, toOneDecimal: (value: number) => number) {
    return rows.map((row) => {
        const sets = row.exercises.flatMap((exercise) => exercise.sets);

        const weights = sets.map((set) => set.weight).filter((weight): weight is number => typeof weight === "number");

        const totalReps = sets.reduce((sum, set) => sum + (typeof set.reps === "number" ? set.reps : 0), 0);
        const totalDurationSeconds = sets.reduce((sum, set) => sum + (typeof set.durationSeconds === "number" ? set.durationSeconds : 0), 0);

        const averageWeight = weights.length > 0 ? toOneDecimal(weights.reduce((sum, weight) => sum + weight, 0) / weights.length) : null;

        const maxWeight = weights.length > 0 ? toOneDecimal(Math.max(...weights)) : null;

        return {
            totalReps,
            totalDurationSeconds,
            averageWeight,
            maxWeight,
        };
    });
}
