import { prisma } from "../../db";

export async function editThreadService(userId: number, threadId: number, data: { title?: string; body?: string }) {
    const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: { authorId: true, title: true, body: true },
    });

    if (!thread) return { status: "not_found" as const };
    if (thread.authorId !== userId) return { status: "unauthorised" as const };

    const nextTitle = data.title?.trim();
    const nextBody = data.body?.trim();

    const titleProvided = data.title !== undefined;
    const bodyProvided = data.body !== undefined;

    const titleSame = !titleProvided || nextTitle === thread.title;
    const bodySame = !bodyProvided || nextBody === thread.body;

    if (titleSame && bodySame) return { status: "no_changes" as const };

    const updated = await prisma.thread.update({
        where: { id: threadId },
        data: {
            ...(titleProvided ? { title: nextTitle! } : {}),
            ...(bodyProvided ? { body: nextBody! } : {}),
        },
        select: { id: true, title: true, body: true, updatedAt: true },
    });

    return { status: "ok" as const, thread: updated };
}
