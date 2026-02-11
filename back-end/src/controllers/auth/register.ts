import type { Request, Response } from "express";
import { registerSchema } from "../../schemas/auth/register";
import { registerService } from "../../services/auth/register";

export async function registerController(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
        }));
        return res.status(400).json({ errors });
    }

    const result = await registerService(parsed.data);

    if (result.status === "email_taken") {
        return res.status(409).json({
            errors: [{ field: "email", message: "Email already exists." }],
        });
    }

    if (result.status === "username_taken") {
        return res.status(409).json({
            errors: [{ field: "username", message: "Username already exists." }],
        });
    }

    if (result.status === "password_mismatch") {
        return res.status(400).json({
            errors: [{ field: "confirmPassword", message: "Password and confirm password must match." }],
        });
    }

    return res.status(200).json({ message: "Registration was successful!" });
}
