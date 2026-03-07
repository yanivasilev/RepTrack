import { request } from "./customApi/request";

export async function authCheckApi() {
    console.log("[ GET ] /auth/check");

    const data = await request<{ user: { id: number; email: string } }>(
        {
            method: "GET",
            url: "/auth/check",
        },
        "Auth check failed"
    );

    console.log("[ DATA ]", data);
    return data;
}
