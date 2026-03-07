import { prisma } from "../../../db";

export async function createReplyService(userId: number, threadId: number, body: string) {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: { id: true },
    });

    // CHECKS IF THREAD EXISTS
    if (!thread) return { status: "not_found" as const };

    // CREATES REPLY IN DB
    const reply = await prisma.$transaction(async (tx) => {
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

        // UPDATES THREADS REPLY COUNT
        await tx.thread.update({ where: { id: threadId }, data: { replyCount: { increment: 1 } } });

        return created;
    });

    return { status: "ok" as const, reply };
}
