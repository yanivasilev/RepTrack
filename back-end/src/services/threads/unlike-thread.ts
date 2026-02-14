import { prisma } from "../../db";

export async function unlikeThreadService(userId: number, threadId: number) {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: { id: true }
    });

    if (!thread) return { status: "not_found" as const };

    const result = await prisma.$transaction(async (tx) => {

        // CHECK IF ITS ALREADY UNLIKED
        const existing = await tx.threadLike.findUnique({
            where: { threadId_userId: { threadId, userId } },
            select: { id: true }
        });

        if (!existing) {
            const t = await tx.thread.findUnique({
                where: { id: threadId },
                select: { likeCount: true }
            });

            return { status: "ok" as const, liked: false, likeCount: t?.likeCount ?? 0 };
        }

        await tx.threadLike.delete({ where: { threadId_userId: { threadId, userId } }, });

        const updated = await tx.thread.update({
            where: { id: threadId },
            data: { likeCount: { decrement: 1 } },
            select: { likeCount: true }
        });

        return { status: "ok" as const, liked: false, likeCount: updated.likeCount };
    });

    return result;
}
