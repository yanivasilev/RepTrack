import { api } from "../api/customApi/client";
import chalk from "chalk";

export async function authCheck() {
    console.log(chalk.yellow("[ GET ]"), "/auth/check");

    try {
        const res = await api.get("/auth/check");

        console.log(chalk.green("[ STATUS ]"), res.status);
        console.log(chalk.green("[ DATA ]"), res.data);

        return res.data;
    } catch (e: any) {
        const status = e?.response?.status;
        const data = e?.response?.data;

        console.log(chalk.red("[ AUTH CHECK ERROR STATUS ]"), status);
        console.log(chalk.red("[ AUTH CHECK ERROR ]"), data);

        throw e;
    }
}
