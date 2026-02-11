export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (password.length === 0) return "Confirm password is required.";
    if (password !== confirmPassword) return "Password and confirm password must match.";

    return null;
}
