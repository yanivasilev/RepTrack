import jwt from "jsonwebtoken";

export function getUserFromAccessToken(token: string): { id: number; email: string } | null {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

        if (typeof payload.sub !== "string") return null;
        if (typeof payload.email !== "string") return null;

        return { id: Number(payload.sub), email: payload.email };
    } catch {
        return null;
    }
}