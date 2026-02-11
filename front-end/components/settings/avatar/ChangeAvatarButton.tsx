import React, { useState } from "react";
import { View, Text, Pressable, Modal, ActivityIndicator } from "react-native";
import { SubmitChangeAvatar } from "./SubmitChangeAvatar";
import { Row } from "../Row";
import { styles } from "./styles";

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

            {/* FEEDBACK MESSAGE */}
            {(overlay || loading) && (
                <Modal
                    visible={true}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOverlay(null)} // ANDROID BACK BUTTON
                >
                    <View style={styles.overlay}>
                        <View style={!loading && styles.box}>
                            {loading ? (
                                <ActivityIndicator size="large" color="#22c55e" />
                            ) : (
                                <Text
                                    style={[
                                        styles.text,
                                        { color: overlay?.success ? "green" : "red" },
                                    ]}
                                >
                                    {overlay?.text}
                                </Text>
                            )}

                            {!loading && (
                                <Pressable onPress={() => setOverlay(null)} style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}>
                                    <Text style={styles.closeText}>CLOSE</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}
