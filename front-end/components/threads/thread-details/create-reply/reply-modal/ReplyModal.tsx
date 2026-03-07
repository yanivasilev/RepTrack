import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View, ActivityIndicator, } from "react-native";
import { styles } from "./styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ReplyModalProps = {
    visible: boolean;
    initialBody?: string;
    onClose: () => void;
    onSubmit: (body: string) => Promise<void> | void;
};

export default function ReplyModal({ visible, initialBody = "", onClose, onSubmit }: ReplyModalProps) {
    const [body, setBody] = useState(initialBody);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) setBody(initialBody);
    }, [visible, initialBody]);

    const trimmed = useMemo(() => body.trim(), [body]);
    const canSend = trimmed.length > 0 && !loading;

    const close = () => {
        if (loading) return;
        onClose();
    };

    const submit = async () => {
        if (!canSend) return;

        try {
            setLoading(true);
            await onSubmit(trimmed);
            Keyboard.dismiss();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={close}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.root} edges={["top", "bottom", "left", "right"]}>
                    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.root}>
                                <View style={styles.top}>
                                    <View style={styles.headerSideLeft}>
                                        <Pressable onPress={close} style={styles.button}>
                                            <Text style={styles.cancel}>Cancel</Text>
                                        </Pressable>
                                    </View>

                                    <Text style={styles.title}>Reply</Text>

                                    <View style={styles.headerSideRight}>
                                        <Pressable onPress={submit} disabled={!canSend} style={[styles.button, !canSend && styles.onLoading]}>
                                            {loading ? <ActivityIndicator size="small" color="green" /> : <Text style={styles.save}>Post</Text>}
                                        </Pressable>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={body}
                                        onChangeText={setBody}
                                        editable={!loading}
                                        placeholder="Write a reply..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        scrollEnabled
                                        maxLength={2000}
                                        textAlignVertical="top"
                                        style={styles.input}
                                    />
                                    <Text style={{ marginTop: 10, opacity: 0.6, color: "gray" }}>
                                        {body.length}/2000
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}
