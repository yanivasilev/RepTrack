import path from "path";
import fs from "fs/promises";
import { prisma } from "../../db";

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

export async function changeAvatarService(userId: number, newFilename: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarFileName: true },
    });

    // CHECKS IF USER EXISTS
    if (!user) return { status: "user_not_found" as const };

    // CHECKS IF USER EXISTS AND CHECKS IF AVATAR FILE NAME IS EMPTY
    const oldFilename = user.avatarFileName ?? null;

    // UPDATES DB
    await prisma.user.update({
        where: { id: userId },
        data: { avatarFileName: newFilename },
    });

    // CHECKS IF OLD FILE STILL EXISTS AND DELETES IT
    if (oldFilename && oldFilename !== newFilename) await fs.unlink(path.join(AVATAR_DIR, oldFilename)).catch(() => { });

    return { status: "updated" as const };
}
