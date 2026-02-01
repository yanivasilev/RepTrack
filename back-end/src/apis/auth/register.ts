import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../db";
import { registerSchema } from "../../schemas/auth/registerSchema";

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) return res.status(409).json("Email already exists.");

    if (data.password !== data.rePassword) return res.status(409).json("Password and re-password must match.");

    const existingUsername = await prisma.user.findUnique({ where: { username: data.username } });
    if (existingUsername) return res.status(409).json("Username already exists.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            username: data.username,
            dob: data.dob,
            sex: data.sex,
            height: data.height,
            weight: data.weight,
            fitnessGoal: data.fitnessGoal,
            experienceLevel: data.experienceLevel,
            trainingStyle: data.trainingStyle,
            trainingFrequency: data.trainingFrequency,
        },
        select: { id: true, email: true, username: true, createdAt: true },
    });

    return res.status(201).json({ user });
}
