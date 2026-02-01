import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireLoggedIn(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) return res.status(401).json("You must be logged in.");

    const accessToken = header.split(" ")[1];

    try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwt.JwtPayload;

        req.user = {
            id: String(payload.sub),
            email: String(payload.email),
        };

        return next();
    } catch {
        return res.status(401).json("Invalid or expired access token.");
    }
}