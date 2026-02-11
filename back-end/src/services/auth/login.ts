import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";

export async function loginService(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return { status: "invalid" as const };

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) return { status: "invalid" as const };

    const secret = process.env.JWT_SECRET;
    if (!secret) return { status: "server_error" as const };

    const accessToken = jwt.sign({ sub: String(user.id), email: user.email }, secret, {
        expiresIn: "7d",
    });

    return { status: "ok" as const, accessToken };
}
