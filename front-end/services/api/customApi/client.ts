import axios, { AxiosHeaders } from "axios";
import { deleteAccessToken, getAccessToken } from "../../../libs/storage/token";
import chalk from "chalk";

export const api = axios.create({
    baseURL: "http://192.168.1.146:3000",
    timeout: 120000,
});

// GETS TOKEN
api.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();

    if (!config.headers) config.headers = AxiosHeaders.from({});

    // ATTACH TOKEN
    if (accessToken) (config.headers as any).Authorization = `Bearer ${accessToken}`;

    // SET JSON CONTENT-TYPE ONLY WHEN NOT FORMDATA AND WHEN NOT ALREADY SET
    const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;

    if (!isFormData && !(config.headers as any)["Content-Type"]) (config.headers as any)["Content-Type"] = "application/json";

    // DEBUGGING LOGS
    console.log(chalk.green("[API CUSTOM REQUEST]"), config.method?.toUpperCase(), config.url);
    console.log(chalk.cyan("[API CUSTOM AUTH HEADER]"), (config.headers as any)?.Authorization ?? "NO AUTH HEADER");
    console.log(chalk.yellow("[API CUSTOM CONTENT-TYPE]"), (config.headers as any)?.["Content-Type"] ?? "NONE");
    console.log(chalk.magenta("[API CUSTOM IS FORMDATA]"), isFormData);

    return config;
});

// HANDLES INVALID TOKEN
api.interceptors.response.use(
    (res) => res,

    async (e) => {
        if (e?.response?.status === 401) await deleteAccessToken();

        return Promise.reject(e);
    }
);