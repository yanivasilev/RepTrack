import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { styles } from "./styles";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type NotesModalProps = {
    visible: boolean;
    title: string;
    value?: string;
    onClose: () => void;
    onSave?: (next: string) => void;
};

export default function NotesModal({ visible, title, value, onClose, onSave }: NotesModalProps) {
    const [text, setText] = useState(value ?? "");

    useEffect(() => {
        if (visible) setText(value ?? "");
    }, [visible, value]);

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaProvider>
                <SafeAreaView style={styles.root}>
                    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                            <View style={styles.root}>
                                <View style={styles.top}>
                                    <View style={styles.sideSlot}>
                                        {onSave && (
                                            <Pressable onPress={onClose} style={styles.button}>
                                                <Text style={styles.cancel}>Cancel</Text>
                                            </Pressable>
                                        )}
                                    </View>

                                    <Text style={styles.title}>{title}</Text>

                                    <View style={styles.sideSlot}>
                                        {!onSave && (
                                            <Pressable onPress={onClose} style={styles.button}>
                                                <Text style={styles.cancel}>Close</Text>
                                            </Pressable>
                                        )}

                                        {onSave && (
                                            <Pressable
                                                onPress={() => onSave(text)}
                                                style={styles.button}
                                            >
                                                <Text style={styles.save}>Save</Text>
                                            </Pressable>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={text}
                                        onChangeText={onSave ? setText : undefined}
                                        editable={!!onSave}
                                        placeholder="Write a note..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        scrollEnabled
                                        maxLength={2000}
                                        textAlignVertical="top"
                                        style={styles.input}
                                    />
                                </View>
                            </View>

                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}
