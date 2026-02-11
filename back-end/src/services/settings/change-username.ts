import { prisma } from "../../db";

const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function changeUsernameService(email: string, data: { username: string }) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { username: true, lastUsernameChangeAt: true },
    });

    // COOLDOWN
    if (user?.lastUsernameChangeAt) {
        const timeSinceChange = Date.now() - user.lastUsernameChangeAt.getTime();

        if (timeSinceChange < COOLDOWN_MS) {
            const daysLeft = Math.ceil((COOLDOWN_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
            return {
                status: "cooldown" as const,
                message: `You can only change your username once every 30 days. Try again in ${daysLeft} days.`,
            };
        }
    }

    // CURRENT USERNAME MATCHES
    if (data.username === user?.username) {
        return { status: "bad_current" as const };
    }

    // NEW USERNAME TAKEN
    const taken = await prisma.user.findUnique({ where: { username: data.username } });
    if (taken) return { status: "taken" as const };

    // UPDATE USERNAME
    await prisma.user.update({
        where: { email },
        data: { username: data.username, lastUsernameChangeAt: new Date() },
    });

    return { status: "updated" as const };
}
