import path from "path";
import fs from "fs/promises";
import { prisma } from "../../db";

const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

export async function changeAvatarService(user: { email: string; avatarFileName?: string | null }, newFilename: string) {
    const oldFilename = user.avatarFileName ?? null;

    // UPDATE AVATAR IN DB
    await prisma.user.update({
        where: { email: user.email },
        data: { avatarFileName: newFilename },
    });

    // DELETE OLD AVATAR FILE
    if (oldFilename && oldFilename !== newFilename) {
        await fs.unlink(path.join(AVATAR_DIR, oldFilename)).catch(() => { });
    }

    return { oldFilename };
}
