export function validateHeight(height: number | null): string | null {
    if (!height) return "Height is required";
    if (Number.isNaN(height)) return "Height must be a number.";
    if (!Number.isInteger(height)) return "Height must be a whole number.";


    if (height < 99) return "Height looks too small.";
    if (height > 240) return "Height looks too large.";

    return null;
}