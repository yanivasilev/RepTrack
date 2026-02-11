export const passwordRegex1 = /[A-Za-z]/;
export const passwordRegex2 = /[0-9]/;
export const passwordRegex3 = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
export const passwordRegex4 = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;

export function validatePassword(password: string): string | null {
    if (password.length === 0) return "Password is required.";
    if (password.length < 8) "Password must be at least 8 characters.";
    if (password.length > 72) "Password must not exceed 72 characters."
    if (!passwordRegex1.test(password)) return "Password must include at least one letter.";
    if (!passwordRegex2.test(password)) return "Password must include at least one number.";
    if (!passwordRegex3.test(password)) return "Password must include at least one special character.";
    if (!passwordRegex4.test(password)) return "Password must not contain illegal characters or spaces.";

    return null;
}
