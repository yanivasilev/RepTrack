import type { Request, Response } from "express";
import { getAllThreadsService } from "../../services/threads/get-all-threads";

export async function getAllThreadsController(req: Request, res: Response) {
    const user = (req as any).user;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if (!Number.isInteger(page) || page <= 0) return res.status(400).json({ message: "Invalid threads page." });

    if (!Number.isInteger(limit) || limit <= 0 || limit > 20) return res.status(400).json({ message: "Invalid threads per page limit (1-20)." });

    const result = await getAllThreadsService(user.id, { page, limit });

    return res.status(200).json(result);
}
