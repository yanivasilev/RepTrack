import axios, { AxiosHeaders } from "axios";
import { deleteAccessToken, getAccessToken } from "../../../libs/storage/token";

export const BASE_URLS = {
    local: process.env.EXPO_PUBLIC_BASE_URL_LOCAL!,
    emo_valyo: process.env.EXPO_PUBLIC_BASE_URL_EMO_VALYO!,
    hotspot: process.env.EXPO_PUBLIC_BASE_URL_HOTSPOT!,
} as const;

const rawEnv = process.env.EXPO_PUBLIC_API_ENV as keyof typeof BASE_URLS | undefined;
export const ENV: keyof typeof BASE_URLS = rawEnv && rawEnv in BASE_URLS ? rawEnv : "local";

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