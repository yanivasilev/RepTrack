export const emailRegex = /^(?!\.)(?!.*\.{2,})([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

export function validateEmail(email: string): string | null {
    if (email.length === 0) return "Email is required";
    if (!emailRegex.test(email)) return "Email must be valid.";
    if (email.length > 254) return "Email is too long.";

    return null;
}
