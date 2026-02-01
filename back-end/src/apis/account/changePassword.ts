import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../db";
import { getEmailFromAccessToken } from "../../services/getEmailbyAccessToken";
import { changePasswordSchema } from "../../schemas/account/changePasswordSchema";

export async function changePassword(req: Request, res: Response) {
    const parsed = changePasswordSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));

        return res.status(400).json({ errors });
    }

    const data = parsed.data;

    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) return res.status(401).json("You must be logged in.");

    const accessToken = header.slice("Bearer ".length);
    const email = getEmailFromAccessToken(accessToken);

    if (!email) return res.status(401).json("Invalid or expired access token.");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json("Invalid or expired access token.");

    const compareCurrentPassword = await bcrypt.compare(data.currentPassword, user?.password);
    if (!compareCurrentPassword) return res.status(404).json("Current password is invalid.");

    if (data.password !== data.rePassword) return res.status(400).json("Password and re-password must match.");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

    return res.status(200).json("Password updated successfully.");
}
