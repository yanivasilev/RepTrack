export function validateReps(reps: number | undefined): string | null {
    if (reps == null) return "Reps is required.";
    if (reps <= 0) return "Reps must be greater than 0.";

    return null;
}
