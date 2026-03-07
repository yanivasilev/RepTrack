"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUsernameService = changeUsernameService;
const db_1 = require("../../db");
const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
async function changeUsernameService(email, data) {
    const user = await db_1.prisma.user.findUnique({
        where: { email },
        select: { username: true, lastUsernameChangeAt: true },
    });
    // COOLDOWN
    if (user?.lastUsernameChangeAt) {
        const timeSinceChange = Date.now() - user.lastUsernameChangeAt.getTime();
        if (timeSinceChange < COOLDOWN_MS) {
            const daysLeft = Math.ceil((COOLDOWN_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
            return {
                status: "cooldown",
                message: `You can only change your username once every 30 days. Try again in ${daysLeft} days.`,
            };
        }
    }
    // CURRENT USERNAME MATCHES
    if (data.username === user?.username) {
        return { status: "bad_current" };
    }
    // NEW USERNAME TAKEN
    const taken = await db_1.prisma.user.findUnique({ where: { username: data.username } });
    if (taken)
        return { status: "taken" };
    // UPDATE USERNAME
    await db_1.prisma.user.update({
        where: { email },
        data: { username: data.username, lastUsernameChangeAt: new Date() },
    });
    return { status: "updated" };
}
