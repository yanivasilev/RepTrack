import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireLoggedOut(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    // Check if there is a token
    if (!header?.startsWith("Bearer ")) return next();

    const accessToken = header.slice("Bearer ".length);

    try {
        // Check if token is valid
        jwt.verify(accessToken, process.env.JWT_SECRET!);

        return res.status(403).json("You are already logged in.");
    } catch {
        // Token invalid or expired
        return next()
    }
}