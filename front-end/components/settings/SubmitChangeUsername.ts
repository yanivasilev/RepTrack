import { submitForm } from "../../forms/submitForm";
import { validateUsername } from "../../forms/validations/validateUsername";
import { ChangeUsernameType } from "../../libs/types/settings/ChangeUsernameType";
import { changeUsernameApi } from "../../services/api/settings/changeUsernameApi";

type Fields = keyof ChangeUsernameType;

export async function SubmitChangeUsername({ data }: { data: ChangeUsernameType }) {
    return submitForm<ChangeUsernameType, Fields, { message?: string }>({
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
