import { prisma } from "../../../db";

export async function deleteReplyService(userId: number, replyId: number) {
    const reply = await prisma.reply.findUnique({
        where: { id: replyId },
        select: { authorId: true, threadId: true },
    });

    // CHECKS IF REPLY EXISTS AND IF AUTHOR MATCHES
    if (!reply) return { status: "not_found" as const };
    if (reply.authorId !== userId) return { status: "unauthorised" as const };

    // DELETES REPLY FROM DB
    await prisma.$transaction(async (tx) => {
        await tx.reply.delete({
            where: { id: replyId },
        });

        await tx.thread.update({
            where: { id: reply.threadId },
            data: { replyCount: { decrement: 1 } },
        });
    });

    return { status: "ok" as const };
}
