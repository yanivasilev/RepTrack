import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireLoggedIn(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    // CHECKS IF USER LOGGED IN
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "You must be logged in." });

    const accessToken = header.split(" ")[1];

    // CHECKS IF SECRET EXISTS
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Server misconfiguration." });

    // CHECKS IF TOKEN IS VALID
    try {
        const payload = jwt.verify(accessToken, secret) as jwt.JwtPayload;

        req.user = {
            id: Number(payload.sub),
            email: String(payload.email),
        };

        return next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired access token." });
    }
}