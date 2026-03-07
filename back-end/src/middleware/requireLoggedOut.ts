import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireLoggedOut(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    // CHECK IF THERE IS A TOKEN
    if (!header?.startsWith("Bearer ")) return next();

    const accessToken = header.slice("Bearer ".length);

    try {
        // CHECK IF TOKEN IS VALID
        jwt.verify(accessToken, process.env.JWT_SECRET!);

        return res.status(403).json("You are already logged in.");
    } catch {
        // TTOKEN INVALID OR EXPIRED
        return next()
    }
}