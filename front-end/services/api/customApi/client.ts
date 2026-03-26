import axios, { AxiosHeaders } from "axios";
import { deleteAccessToken, getAccessToken } from "../../../libs/storage/token";

export const BASE_URLS = {
    local: "http://192.168.1.146:3000",
    emo_valyo: "http://192.168.4.100:3000",
    hotspot: "http://172.20.10.2:3000",
} as const;

export const ENV: keyof typeof BASE_URLS = "local";

export const api = axios.create({
    baseURL: BASE_URLS[ENV],
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
    console.log("[API CUSTOM REQUEST]", config.method?.toUpperCase(), config.url);
    console.log("[API CUSTOM AUTH HEADER]", (config.headers as any)?.Authorization ?? "NO AUTH HEADER");
    console.log("[API CUSTOM CONTENT-TYPE]", (config.headers as any)?.["Content-Type"] ?? "NONE");
    console.log("[API CUSTOM IS FORMDATA]", isFormData);

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