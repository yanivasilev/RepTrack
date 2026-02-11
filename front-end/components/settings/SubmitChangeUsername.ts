import { submitForm } from "../../forms/submitForm";
import { validateUsername } from "../../forms/validations/validateUsername";
import { changeUsernameApi, ChangeUsernamePayload } from "../../services/api/settings/changeUsernameApi";

type Fields = keyof ChangeUsernamePayload;

export async function SubmitChangeUsername({ data }: { data: ChangeUsernamePayload }) {
    return submitForm<ChangeUsernamePayload, Fields, { message?: string }>({
        data,
        validate: (d) => {
            const usernameError = validateUsername(d.username);
            return usernameError ? { username: usernameError } : null;
        },
        apiCall: changeUsernameApi,
        successMessage: (res) => res?.message ?? "Username changed successfully.",
        fallbackErrorMessage: "Change username failed.",
    });
}
