import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";

export async function loginService(data: { email: string; password: string }) {

    // CHECKS IF USER EXISTS
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return { status: "invalid" as const };

    const ok = await bcrypt.compare(data.password, user.password);

    // CHECKS IF PASSWORD MATCHES
    if (!ok) return { status: "invalid" as const };

    // CHECKS IF USER IS VERIFIED
    if (!user.emailVerifiedAt) return { status: "email_not_verified" as const };

    // CHECKS IF SECRET EXISTS
    const secret = process.env.JWT_SECRET;
    if (!secret) return { status: "server_error" as const };

    // GENERATES ACCESS TOKEN
    const accessToken = jwt.sign({ sub: String(user.id), email: user.email }, secret, {
        expiresIn: "7d",
    });

    return { status: "ok" as const, accessToken };
}
