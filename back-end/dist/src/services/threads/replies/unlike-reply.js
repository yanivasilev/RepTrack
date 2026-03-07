"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeReplyService = unlikeReplyService;
const db_1 = require("../../../db");
async function unlikeReplyService(userId, replyId) {
    const reply = await db_1.prisma.reply.findUnique({
        where: { id: replyId },
        select: { id: true }
    });
    if (!reply)
        return { status: "not_found" };
    const result = await db_1.prisma.$transaction(async (tx) => {
        // CHECK IF ITS ALREADY UNLIKED
        const existing = await tx.replyLike.findUnique({
            where: { replyId_userId: { replyId, userId } },
            select: { id: true }
        });
        if (!existing) {
            const t = await tx.reply.findUnique({
                where: { id: replyId },
                select: { likeCount: true }
            });
            return { status: "ok", liked: false, likeCount: t?.likeCount ?? 0 };
        }
        await tx.replyLike.delete({ where: { replyId_userId: { replyId, userId } }, });
        const updated = await tx.reply.update({
            where: { id: replyId },
            data: { likeCount: { decrement: 1 } },
            select: { likeCount: true }
        });
        return { status: "ok", liked: false, likeCount: updated.likeCount };
    });
    return result;
}
