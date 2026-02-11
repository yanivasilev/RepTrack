import jwt from "jsonwebtoken";

export function getEmailFromAccessToken(token: string): string | null {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        if (typeof payload.email !== "string") return null;

        return payload.email;
    } catch {
        // INVALID OR EXPIRED TOKEN
        return null;
    }
}
