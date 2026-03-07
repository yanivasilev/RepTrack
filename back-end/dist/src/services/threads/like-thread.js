"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeThreadService = likeThreadService;
const db_1 = require("../../db");
async function likeThreadService(userId, threadId) {
    const thread = await db_1.prisma.thread.findUnique({
        where: { id: threadId },
        select: { id: true }
    });
    if (!thread)
        return { status: "not_found" };
    const result = await db_1.prisma.$transaction(async (tx) => {
        // CHECK IF ITS ALREADY LIKED
        const existing = await tx.threadLike.findUnique({
            where: { threadId_userId: { threadId, userId } },
            select: { id: true }
        });
        if (existing) {
            const t = await tx.thread.findUnique({
                where: { id: threadId },
                select: { likeCount: true }
            });
            return { status: "ok", liked: true, likeCount: t?.likeCount ?? 0 };
        }
        await tx.threadLike.create({ data: { threadId, userId } });
        const updated = await tx.thread.update({
            where: { id: threadId },
            data: { likeCount: { increment: 1 } },
            select: { likeCount: true }
        });
        return { status: "ok", liked: true, likeCount: updated.likeCount };
    });
    return result;
}
