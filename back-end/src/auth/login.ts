import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { loginSchema } from "../schemas/loginSchema";

export async function login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    // Checking if use exists
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        return res.status(401).json("Email or password is invalid.");
    }

    // Checking if password is valid
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) {
        return res.status(401).json("Email or password is invalid.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json("Access token not set.");

    // Generating access token
    const accessToken = jwt.sign({ sub: String(user.id), email: user.email }, secret, {
        expiresIn: "7d",
    });

    return res.json({ accessToken });
}
