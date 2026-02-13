import type { AxiosRequestConfig } from "axios";
import { normaliseApiError } from "./normaliseError";
import { api } from "./client";

// REQUEST WRAPPER
// HELPS MAKING API ENDPOINTS SHORTER
export async function request<T>(config: AxiosRequestConfig, fallbackMsg?: string): Promise<T> {
    try {
        const res = await api.request<T>(config);
        return res.data;
    } catch (err) {
        throw normaliseApiError(err, fallbackMsg ?? "Request failed.");
    }
}
