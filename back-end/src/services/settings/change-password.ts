import bcrypt from "bcrypt";
import { prisma } from "../../db";

export async function changePasswordService(email: string, data: { currentPassword: string; newPassword: string; newConfirmPassword: string }) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { password: true },
    });

    if (!user) return { status: "user_not_found" as const };

    const ok = await bcrypt.compare(data.currentPassword, user.password);
    if (!ok) return { status: "bad_current" as const };

    if (data.newPassword !== data.newConfirmPassword) return { status: "mismatch" as const };

    if (data.currentPassword === data.newPassword) return { status: "same" as const };

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
    });

    return { status: "updated" as const };
}
