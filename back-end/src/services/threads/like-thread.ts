import { prisma } from "../../db";

export async function likeThreadService(userId: number, threadId: number) {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: { id: true }
    });

    // CHECKS IF THREAD EXISTS
    if (!thread) return { status: "not_found" as const };

    const result = await prisma.$transaction(async (tx) => {

        const existing = await tx.threadLike.findUnique({
            where: { threadId_userId: { threadId, userId } },
            select: { id: true }
        });

        // CHECKS IF ITS ALREADY LIKED
        if (existing) {
            const t = await tx.thread.findUnique({
                where: { id: threadId },
                select: { likeCount: true }
            });

            return { status: "ok" as const, liked: true, likeCount: t?.likeCount ?? 0 };
        }

        // UPDATES DB
        await tx.threadLike.create({ data: { threadId, userId } });

        const updated = await tx.thread.update({
            where: { id: threadId },
            data: { likeCount: { increment: 1 } },
            select: { likeCount: true }
        });

        return { status: "ok" as const, liked: true, likeCount: updated.likeCount };
    });

    return result;
}
