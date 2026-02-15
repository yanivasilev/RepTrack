import { prisma } from "../../../db";

export async function editReplyService(userId: number, replyId: number, data: { body: string }) {
    const reply = await prisma.reply.findUnique({
        where: { id: replyId },
        select: { authorId: true, body: true },
    });

    if (!reply) return { status: "not_found" as const };
    if (reply.authorId !== userId) return { status: "unauthorised" as const };

    const newBody = data.body.trim();

    if (newBody === reply.body) return { status: "no_changes" as const };

    const updated = await prisma.reply.update({
        where: { id: replyId },
        data: { body: newBody },
        select: {
            id: true,
            body: true,
            updatedAt: true,
        },
    });

    return { status: "ok" as const, reply: updated };
}
