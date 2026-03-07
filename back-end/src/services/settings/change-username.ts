import { prisma } from "../../db";

const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 DAYS

export async function changeUsernameService(userId: number, data: { username: string }) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, lastUsernameChangeAt: true },
    });

    // CHECKS IF USER EXISTS
    if (!user) return { status: "user_not_found" as const };

    // CHECKS IF LAST USERNAME WAS CHANGED WITHIN 30 DAYS (THERE IS A 30 DAY COOLDOWN BETWEEN CHANGING USERNAMES)
    if (user.lastUsernameChangeAt) {
        const timeSinceChange = Date.now() - user.lastUsernameChangeAt.getTime();

        if (timeSinceChange < COOLDOWN_MS) {
            const daysLeft = Math.ceil((COOLDOWN_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
            return {
                status: "cooldown" as const,
                message: `You can only change your username once every 30 days. Try again in ${daysLeft} days.`,
            };
        }
    }

    // CHECKS IF NEW USERNAME MATCHES CURRENT USERNAME
    if (data.username === user.username) return { status: "bad_current" as const };

    // CHECKS IF NEW USERNAME IS TAKEN
    const taken = await prisma.user.findUnique({ where: { username: data.username } });
    if (taken) return { status: "taken" as const };

    // UPDATES USERNAME IN THE DB
    await prisma.user.update({
        where: { id: userId },
        data: { username: data.username, lastUsernameChangeAt: new Date() },
    });

    return { status: "updated" as const };
}
