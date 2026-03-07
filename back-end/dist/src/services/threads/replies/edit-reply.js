"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editReplyService = editReplyService;
const db_1 = require("../../../db");
async function editReplyService(userId, replyId, data) {
    const reply = await db_1.prisma.reply.findUnique({
        where: { id: replyId },
        select: { authorId: true, body: true },
    });
    if (!reply)
        return { status: "not_found" };
    if (reply.authorId !== userId)
        return { status: "unauthorised" };
    const newBody = data.body.trim();
    if (newBody === reply.body)
        return { status: "no_changes" };
    const updated = await db_1.prisma.reply.update({
        where: { id: replyId },
        data: { body: newBody },
        select: {
            id: true,
            body: true,
            updatedAt: true,
        },
    });
    return { status: "ok", reply: updated };
}
