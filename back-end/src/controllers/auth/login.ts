import type { Request, Response } from "express";
import { loginSchema } from "../../schemas/auth/login";
import { loginService } from "../../services/auth/login";

export async function loginController(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await loginService(parsed.data);

    if (result.status === "invalid") {
        return res.status(401).json({ message: "Email or password is invalid." });
    }

    if (result.status === "server_error") {
        return res.status(500).json({ message: "Access token was not generated." });
    }

    return res.json({ accessToken: result.accessToken });
}
