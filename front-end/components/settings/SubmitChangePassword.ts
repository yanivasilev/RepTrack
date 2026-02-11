import { submitForm } from "../../forms/submitForm";
import { validateConfirmPassword } from "../../forms/validations/validateConfirmPassword";
import { validatePassword } from "../../forms/validations/validatePassword";
import { validateCurrentPassword } from "../../forms/validations/vildateCurrentPassword";
import { changePasswordApi, ChangePasswordPayload } from "../../services/api/settings/changePasswordApi";

type Fields = keyof ChangePasswordPayload;

export async function SubmitChangePassword({ data }: { data: ChangePasswordPayload }) {
    return submitForm<ChangePasswordPayload, Fields, { message?: string }>({
        data,
        validate: (d) => {
            const errors: Partial<Record<Fields, string>> = {};

            const currentPasswordError = validateCurrentPassword(d.currentPassword);
            if (currentPasswordError) errors.currentPassword = currentPasswordError;

            const newPasswordError = validatePassword(d.newPassword);
            if (newPasswordError) errors.newPassword = newPasswordError;

            const newConfirmPasswordError = validateConfirmPassword(d.newPassword, d.newConfirmPassword);
            if (newConfirmPasswordError) errors.newConfirmPassword = newConfirmPasswordError;

            return Object.keys(errors).length ? errors : null;
        },
        apiCall: changePasswordApi,
        successMessage: (res) => res?.message ?? "Password changed successfully.",
        fallbackErrorMessage: "Change password failed.",
    });
}
