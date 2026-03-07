import { prisma } from "../../db";

export async function deleteThreadService(userId: number, threadId: number) {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: { authorId: true },
    });

    // CHECKS IF THREAD EXISTS
    if (!thread) return { status: "not_found" as const };

    // CHECKS IF AUTHOR MATCHES
    if (thread.authorId !== userId) return { status: "unauthorised" as const };

    // DELETES THREAD FROM DB
    await prisma.thread.delete({
        where: { id: threadId },
    });

    return { status: "ok" as const };
}
