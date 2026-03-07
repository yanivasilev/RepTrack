import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "./styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type ThreadModalProps = {
    visible: boolean;
    initialTitle?: string;
    initialBody?: string;
    onClose: () => void;
    onSubmit: (values: { title: string; body: string }) => Promise<void> | void;
};

export default function ThreadModal({ visible, initialTitle = "", initialBody = "", onClose, onSubmit }: ThreadModalProps) {
    const [title, setTitle] = useState(initialTitle);
    const [body, setBody] = useState(initialBody);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;

        setTitle(initialTitle);
        setBody(initialBody);
    }, [visible, initialTitle, initialBody]);

    const trimmedTitle = useMemo(() => title.trim(), [title]);
    const trimmedBody = useMemo(() => body.trim(), [body]);
    const canSend = trimmedTitle.length >= 3 && trimmedBody.length > 0 && !loading;

    const close = () => {
        if (loading) return;
        onClose();
    };

    const submit = async () => {
        if (!canSend) return;

        try {
            setLoading(true);
            await onSubmit({ title: trimmedTitle, body: trimmedBody });
            Keyboard.dismiss();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={close}>
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

                                    <Text style={styles.title}>Thread</Text>

                                    <View style={styles.headerSideRight}>
                                        <Pressable onPress={submit} disabled={!canSend} style={[styles.button, !canSend && styles.onLoading]}>
                                            {loading ? <ActivityIndicator size="small" color="green" /> : <Text style={styles.save}>Post</Text>}
                                        </Pressable>
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={title}
                                        onChangeText={setTitle}
                                        editable={!loading}
                                        placeholder="Title..."
                                        placeholderTextColor="#9CA3AF"
                                        maxLength={120}
                                        style={styles.titleInput}
                                    />
                                    <Text style={styles.lengthCount}>
                                        {title.length}/120
                                    </Text>

                                    <TextInput
                                        value={body}
                                        onChangeText={setBody}
                                        editable={!loading}
                                        placeholder="Write a thread..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        scrollEnabled
                                        maxLength={5000}
                                        textAlignVertical="top"
                                        style={styles.input}
                                    />

                                    <Text style={styles.lengthCount}>
                                        {body.length}/5000
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
