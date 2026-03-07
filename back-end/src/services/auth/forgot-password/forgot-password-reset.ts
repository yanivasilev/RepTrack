import bcrypt from "bcrypt";
import { prisma } from "../../../db";
import { verifyFPtoken } from "../../../libs/forgot-password/verifyFPtoken";

export async function forgotPasswordResetService(data: { email: string; token: string; password: string; confirmPassword: string }) {
    // CHECKS IF PASSWORD MATCH
    if (data.password !== data.confirmPassword) return { status: "password_mismatch" as const };

    // CHECKS IF USER EXISTS
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return { status: "invalid_session" as const };

    // CHECKS IF ISER HAS REQUESTED FORGOT PASSWORD SESION
    const record = await prisma.forgotPasswordSession.findUnique({ where: { userId: user.id } });
    if (!record) return { status: "invalid_session" as const };

    // CHECKS IF SESSION IS EXPIRED OR USED
    if (record.usedAt) return { status: "invalid_session" as const };
    if (record.expiresAt <= new Date()) return { status: "invalid_session" as const };

    // CHECKS IF SESSION TOKEN MATCHES
    if (!verifyFPtoken(data.token, record.tokenHash)) return { status: "invalid_session" as const };

    // HASHES PASSWORD
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // UPDATES PASSWORD IN THE DB
    await prisma.$transaction([
        prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        }),
        prisma.forgotPasswordSession.update({
            where: { userId: user.id },
            data: { usedAt: new Date() },
        }),
    ]);

    return { status: "ok" as const };
}
