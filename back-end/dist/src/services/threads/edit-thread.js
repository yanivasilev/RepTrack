"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editThreadService = editThreadService;
const db_1 = require("../../db");
async function editThreadService(userId, threadId, data) {
    const thread = await db_1.prisma.thread.findUnique({
        where: { id: threadId },
        select: { authorId: true, title: true, body: true },
    });
    if (!thread)
        return { status: "not_found" };
    if (thread.authorId !== userId)
        return { status: "unauthorised" };
    const newTitle = data.title?.trim();
    const newBody = data.body?.trim();
    const titleProvided = data.title !== undefined;
    const bodyProvided = data.body !== undefined;
    const titleSame = !titleProvided || newTitle === thread.title;
    const bodySame = !bodyProvided || newBody === thread.body;
    if (titleSame && bodySame)
        return { status: "no_changes" };
    const updated = await db_1.prisma.thread.update({
        where: { id: threadId },
        data: {
            ...(titleProvided ? { title: newTitle } : {}),
            ...(bodyProvided ? { body: newBody } : {}),
        },
        select: { id: true, title: true, body: true, updatedAt: true },
    });
    return { status: "ok", thread: updated };
}
