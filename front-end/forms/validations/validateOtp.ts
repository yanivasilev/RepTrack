export const emailRegex = /^(?!\.)(?!.*\.{2,})([A-Z0-9_'+-\.]*)[A-Z0-9_'+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

export function validateOtp(email: string): string | null {
    if (email.length === 0) return "OTP is required.";
    if (email.length < 6) return "OTP needs to be longer, eactly 6 characters.";
    if (email.length > 6) return "OTP is too long.";

    return null;
}
