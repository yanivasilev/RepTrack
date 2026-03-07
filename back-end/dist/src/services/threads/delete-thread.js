"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteThreadService = deleteThreadService;
const db_1 = require("../../db");
async function deleteThreadService(userId, threadId) {
    const thread = await db_1.prisma.thread.findUnique({
        where: { id: threadId },
        select: { authorId: true },
    });
    if (!thread)
        return { status: "not_found" };
    if (thread.authorId !== userId)
        return { status: "unauthorised" };
    await db_1.prisma.thread.delete({
        where: { id: threadId },
    });
    return { status: "ok" };
}
