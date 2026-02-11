export const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;

export function validateUsername(username: string): string | null {
    if (username.length === 0) return "Username is required.";
    if (username.length < 3) return "Username must be at least 3 characters.";
    if (username.length > 20) return "Username must not exceed 20 characters.";
    if (!usernameRegex.test(username)) return "Username can only contain letters, numbers, '.' and '_'.";
    return null;
}
