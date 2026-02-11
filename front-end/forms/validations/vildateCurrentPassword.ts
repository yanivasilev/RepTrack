export function validateCurrentPassword(password: string): string | null {
    if (password.length === 0) return "Current password is required.";
    return null;
}
