import axios from "axios";
import { LoginFormData } from "../../../components/login/LoginForm";

type LoginPayload = {
    email: string;
    password: string;
};

type LoginApiResponse = {
    accessToken: string;
};

// CUSTOM ERROR  TYPE SO UI CAN SHOW THE ERRORS + MESSAGES FROM API
export class ApiError extends Error {
    fieldErrors?: Record<string, string>;
    status?: number;

    constructor(message: string, opts?: { fieldErrors?: Record<string, string>; status?: number }) {
        super(message);
        this.name = "ApiError";
        this.fieldErrors = opts?.fieldErrors;
        this.status = opts?.status;
    }
}

export async function loginApi(data: LoginFormData): Promise<LoginApiResponse> {
    const payload: LoginPayload = {
        email: data.email,
        password: data.password,
    };

    console.log("\x1b[42m POST \x1b[0m /auth/login PAYLOAD:", payload);

    try {
        const res = await axios.post<LoginApiResponse>(
            "http://192.168.1.146:3000/auth/login",
            payload,
            {
                headers: { "Content-Type": "application/json" },
                timeout: 15000,
            }
        );

        console.log("\x1b[43m STATUS \x1b[0m", res.status);
        console.log("\x1b[43m DATA \x1b[0m", res.data);

        return res.data;
    } catch (err: any) {
        const status = err?.response?.status;
        const json = err?.response?.data;

        console.log("\x1b[41m LOGIN ERROR STATUS \x1b[0m", status);
        console.log("\x1b[41m LOGIN ERROR \x1b[0m", json);

        // IF BACKEND SENDS ZOD ERRORS:
        if (json?.errors?.length) {
            const fieldErrors: Record<string, string> = {};

            for (const e of json.errors) {
                if (!fieldErrors[e.field]) fieldErrors[e.field] = e.message;
            }

            throw new ApiError("Validation failed", { fieldErrors, status });
        }

        // FALL BACK ERROR MESSAGE
        const message = json?.message ?? err?.message ?? (status ? `Login failed. (STATUS: ${status})` : "Login failed.");

        throw new ApiError(message, { status });
    }
}
