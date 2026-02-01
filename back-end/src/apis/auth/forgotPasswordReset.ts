import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../db";
import { forgotPasswordResetSchema } from "../../schemas/auth/forgotPasswordResetSchema";
import { verifyFPtoken } from "../../services/verifyFPtoken";

export async function forgotPasswordReset(req: Request, res: Response) {
    const parsed = forgotPasswordResetSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    if (data.password !== data.rePassword) return res.status(409).json("Password and re-password must match.");

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return res.status(400).json("Your reset password session is either invalid or expired.");

    // Check if user has a token session record
    const record = await prisma.forgotPasswordSession.findUnique({ where: { userId: user?.id } })
    if (!record) return res.status(400).json("Your reset password session is either invalid or expired.");

    // Already used token session
    if (record.usedAt) return res.status(400).json("Your reset password session is either invalid or expired.");

    // Expired token session
    if (record.expiresAt <= new Date()) return res.status(400).json("Your reset password session is either invalid or expired.");

    // Checks if token is valid
    const storedTokenHash = record.tokenHash;
    if (!verifyFPtoken(data.token, storedTokenHash)) return res.status(400).json("Your reset password session is either invalid or expired.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.$transaction([
        // Marking token as used
        prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        }),

        // Changing password
        prisma.forgotPasswordSession.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
    ]);
    return res.status(200).json("Your password was changed successfully.");
}
