import bcrypt from "bcrypt";
import { prisma } from "../../db";

export async function changePasswordService(userId: number, data: { currentPassword: string; newPassword: string; newConfirmPassword: string }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
    });

    // CHECKS IF USER EXISTS
    if (!user) return { status: "user_not_found" as const };

    // CHECKS IF CURRENT PASSWORD MATCHES
    const ok = await bcrypt.compare(data.currentPassword, user.password);
    if (!ok) return { status: "bad_current" as const };

    // CHECKS IF PASSWORDS MATCH
    if (data.newPassword !== data.newConfirmPassword) return { status: "mismatch" as const };

    // CHECKS IF NEW PASSWORD MATCHES CURRENT PASSWORD
    if (data.currentPassword === data.newPassword) return { status: "same" as const };

    // HASHES NEW PASSOWRD
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // UPDATES PASSWORD IN THE DB
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    return { status: "updated" as const };
}
