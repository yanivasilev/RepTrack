import * as ImagePicker from "expo-image-picker";
import { changeAvatarApi } from "../../../services/api/settings/changeAvatarApi";

export async function SubmitChangeAvatar(): Promise<{
    success: boolean;
    message: string;
}> {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
        return { success: false, message: "Permission denied. Please allow photo access." };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });

    if (result.canceled) {
        return { success: false, message: "Canceled" };
    }

    const asset = result.assets[0];

    const uri = asset.uri;
    const name =
        (asset as any).fileName ??
        `avatar-${Date.now()}.jpg`;

    const type = asset.mimeType ?? "image/jpeg";

    const res = await changeAvatarApi({ uri, name, type });

    return {
        success: true,
        message: res.message ?? "Avatar updated successfully.",
    };
}
