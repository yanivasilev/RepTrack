import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View, } from "react-native";
import { styles } from "./styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type EditModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: { title?: string; body: string }) => Promise<void> | void;
    initialTitle?: string;
    initialBody: string;
    headerTitle: string;
    submitText?: string;
    bodyPlaceholder?: string;
    titlePlaceholder?: string;
    requireChange?: boolean;
    requireTitle?: boolean;
    requireBody?: boolean;
    maxTitleLength?: number;
    maxBodyLength?: number;
};

export default function EditModal({ visible, onClose, onSubmit, initialTitle, initialBody, headerTitle, submitText = "Save", bodyPlaceholder = "Body...",
    titlePlaceholder = "Title...", requireChange = true, requireTitle = true, requireBody = true, maxTitleLength = 120, maxBodyLength = 5000 }: EditModalProps) {

    const [title, setTitle] = useState(initialTitle ?? "");
    const [body, setBody] = useState(initialBody ?? "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) return;
        setTitle(initialTitle ?? "");
        setBody(initialBody ?? "");
    }, [visible, initialTitle, initialBody]);

    const trimmedTitle = useMemo(() => title.trim(), [title]);
    const trimmedBody = useMemo(() => body.trim(), [body]);

    const initialTrimmedTitle = useMemo(() => (initialTitle ?? "").trim(), [initialTitle]);
    const initialTrimmedBody = useMemo(() => (initialBody ?? "").trim(), [initialBody]);

    const hasTitleField = initialTitle !== undefined;
    const titleChanged = hasTitleField ? trimmedTitle !== initialTrimmedTitle : false;
    const bodyChanged = trimmedBody !== initialTrimmedBody;

    const hasChanged = hasTitleField ? (titleChanged || bodyChanged) : bodyChanged;

    const meetsRequired = (!requireTitle || !hasTitleField || trimmedTitle.length >= 3) && (!requireBody || trimmedBody.length > 0);

    const canSubmit = !loading && meetsRequired && (!requireChange || hasChanged);

    const close = () => {
        if (loading) return;
        onClose();
    };

    const submit = async () => {
        if (!canSubmit) return;
        try {
            setLoading(true);
            await onSubmit({
                ...(hasTitleField ? { title: trimmedTitle } : {}),
                body: trimmedBody,
            });
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
                                    <Pressable onPress={close} disabled={loading} style={[styles.button, loading && { opacity: 0.5 }]}>
                                        <Text style={styles.cancel}>Cancel</Text>
                                    </Pressable>

                                    <Text style={styles.title}>{headerTitle}</Text>

                                    <Pressable
                                        onPress={submit}
                                        disabled={!canSubmit}
                                        style={[styles.button, styles.saveButton, !canSubmit && { opacity: 0.5 }]}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color="blue" />
                                        ) : (
                                            <Text style={styles.save}>{submitText}</Text>
                                        )}
                                    </Pressable>
                                </View>

                                <View style={styles.inputContainer}>
                                    {hasTitleField && (
                                        <>
                                            <TextInput
                                                value={title}
                                                onChangeText={setTitle}
                                                editable={!loading}
                                                placeholder={titlePlaceholder}
                                                placeholderTextColor="#9CA3AF"
                                                maxLength={maxTitleLength}
                                                style={styles.titleInput}
                                            />
                                            <Text style={{ marginBottom: 10, opacity: 0.6, color: "gray" }}>
                                                {title.length}/{maxTitleLength}
                                            </Text>
                                        </>
                                    )}

                                    <TextInput
                                        value={body}
                                        onChangeText={setBody}
                                        editable={!loading}
                                        placeholder={bodyPlaceholder}
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        scrollEnabled
                                        maxLength={maxBodyLength}
                                        textAlignVertical="top"
                                        style={styles.input}
                                    />
                                    <Text style={{ marginTop: 10, opacity: 0.6, color: "gray" }}>
                                        {body.length}/{maxBodyLength}
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
