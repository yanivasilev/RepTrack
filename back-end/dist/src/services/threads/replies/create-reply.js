"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplyService = createReplyService;
const db_1 = require("../../../db");
async function createReplyService(userId, threadId, body) {
    const thread = await db_1.prisma.thread.findUnique({
        where: { id: threadId },
        select: { id: true },
    });
    if (!thread)
        return { status: "not_found" };
    const reply = await db_1.prisma.$transaction(async (tx) => {
        const created = await tx.reply.create({
            data: {
                body,
                authorId: userId,
                threadId,
            },
            select: {
                id: true,
                body: true,
                createdAt: true,
                author: {
                    select: { id: true, username: true, avatarFileName: true },
                },
            },
        });
        await tx.thread.update({ where: { id: threadId }, data: { replyCount: { increment: 1 } } });
        return created;
    });
    return { status: "ok", reply };
}
