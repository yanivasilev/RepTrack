import React, { useState } from "react";
import { View } from "react-native";
import { SubmitChangeAvatar } from "./SubmitChangeAvatar";
import { Row } from "../Row";
import FeedbackModal from "../../FeedbackModal";

export function ChangeAvatarButton({ onAvatarChanged }: { onAvatarChanged?: () => Promise<void> | void }) {
    const [loading, setLoading] = useState(false);
    const [overlay, setOverlay] = useState<{ text: string; success: boolean } | null>(null);

    const handlePress = async () => {
        if (loading) return;
        setLoading(true);
        setOverlay(null);

        try {
            const res = await SubmitChangeAvatar();

            if (res.message === "Canceled") return;

            setOverlay({ text: res.message, success: res.success });

            if (res.success) {
                await onAvatarChanged?.();
            }
        } catch (e: any) {
            setOverlay({
                text: e?.message ?? "Avatar upload failed.",
                success: false
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Row title="Change avatar" onPress={handlePress} />
            <FeedbackModal
                visible={Boolean(overlay) || loading}
                loading={loading}
                message={overlay?.text}
                success={overlay?.success}
                onClose={() => setOverlay(null)}
            />
        </View>
    );
}
