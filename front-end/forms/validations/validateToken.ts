export function validateToken(token: string): string | null {
    if (token.length === 0) return "Token is required.";
    if (token.length > 64) return "Token is too long.";

    return null;
}
