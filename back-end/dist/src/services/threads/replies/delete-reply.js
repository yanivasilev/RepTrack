"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReplyService = deleteReplyService;
const db_1 = require("../../../db");
async function deleteReplyService(userId, replyId) {
    const reply = await db_1.prisma.reply.findUnique({
        where: { id: replyId },
        select: { authorId: true, threadId: true },
    });
    if (!reply)
        return { status: "not_found" };
    if (reply.authorId !== userId)
        return { status: "unauthorised" };
    await db_1.prisma.$transaction(async (tx) => {
        await tx.reply.delete({
            where: { id: replyId },
        });
        await tx.thread.update({
            where: { id: reply.threadId },
            data: { replyCount: { decrement: 1 } },
        });
    });
    return { status: "ok" };
}
