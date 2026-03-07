import type { Request, Response } from "express";
import { getAllProfilesSchema } from "../../schemas/profiles/get-all-profiles";
import { getAllProfilesService } from "../../services/profiles/get-all-profiles";

export async function getAllProfilesController(req: Request, res: Response) {
    const parsed = getAllProfilesSchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            errors: parsed.error.issues.map((i) => ({
                field: i.path.join("."),
                message: i.message,
            })),
        });
    }

    const { page, limit, query } = parsed.data;

    const result = await getAllProfilesService(page, limit, query);

    return res.status(200).json(result);
}
