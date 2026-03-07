import { prisma } from "../../../db";

export async function editReplyService(userId: number, replyId: number, body: string) {
    const reply = await prisma.reply.findUnique({
        where: { id: replyId },
        select: { authorId: true, body: true },
    });

    // CHECKS IF REPLY EXISTS AND IF AUTHOR MATCHES
    if (!reply) return { status: "not_found" as const };
    if (reply.authorId !== userId) return { status: "unauthorised" as const };

    const newBody = body.trim();

    // CHECKS IF THERE WE ANY CHANGES
    if (newBody === reply.body) return { status: "no_changes" as const };

    // UPDATES DB
    const updated = await prisma.reply.update({
        where: { id: replyId },
        data: { body: newBody },
        select: {
            id: true,
            body: true,
            updatedAt: true,
        },
    });

    return { status: "updated" as const, reply: updated };
}
