import type { Request, Response } from "express";
import { getAllThreadsService } from "../../services/threads/get-all-threads";
import { getAllThreadsSchema } from "../../schemas/threads/get-all-threads";

export async function getAllThreadsController(req: Request, res: Response) {
    const user = (req as any).user;

    const parsed = getAllThreadsSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { page, limit } = parsed.data;

    const result = await getAllThreadsService(user.id, { page, limit });

    return res.status(200).json(result);
}
