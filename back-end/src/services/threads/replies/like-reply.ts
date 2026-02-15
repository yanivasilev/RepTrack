import { prisma } from "../../../db";

export async function likeReplyService(userId: number, replyId: number) {
    const reply = await prisma.reply.findUnique({
        where: { id: replyId },
        select: { id: true }
    });

    if (!reply) return { status: "not_found" as const };

    const result = await prisma.$transaction(async (tx) => {

        // CHECK IF ITS ALREADY LIKED
        const existing = await tx.replyLike.findUnique({
            where: { replyId_userId: { replyId, userId } },
            select: { id: true }
        });

        if (existing) {
            const t = await tx.reply.findUnique({
                where: { id: replyId },
                select: { likeCount: true }
            });

            return { status: "ok" as const, liked: true, likeCount: t?.likeCount ?? 0 };
        }

        await tx.replyLike.create({ data: { replyId, userId } });

        const updated = await tx.reply.update({
            where: { id: replyId },
            data: { likeCount: { increment: 1 } },
            select: { likeCount: true }
        });

        return { status: "ok" as const, liked: true, likeCount: updated.likeCount };
    });

    return result;
}
