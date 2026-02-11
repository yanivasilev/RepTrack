import { api } from "../api/customApi/client";

export async function authCheck() {
    console.log("\x1b[42m GET \x1b[0m /auth/check");

    try {
        const res = await api.get("/auth/check");

        console.log("\x1b[43m STATUS \x1b[0m", res.status);
        console.log("\x1b[43m DATA \x1b[0m", res.data);

        return res.data;
    } catch (e: any) {
        const status = e?.response?.status;
        const data = e?.response?.data;

        console.log("\x1b[41m ATUH CHECK ERROR STATUS \x1b[0m", status);
        console.log("\x1b[41m AUTH CHECK ERROR \x1b[0m", data);

        throw e;
    }
}
