export function validateDurationSeconds(durationSeconds: number | undefined): string | null {
    if (durationSeconds == null) return "Duration is required.";
    if (durationSeconds <= 0) return "Duration must be greater than 0.";

    return null;
}
