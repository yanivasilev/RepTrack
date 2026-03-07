export function validateWeight(weight: number | undefined): string | null {
    if (weight == null) return "Weight is required.";
    if (weight < 0) return "Weight cannot be negative.";

    return null;
}
