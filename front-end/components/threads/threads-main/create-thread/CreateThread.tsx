import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { SquaresPlusIcon } from "react-native-heroicons/outline";
import { styles } from "./styles";
import ThreadModal from "./thread-modal/ThreadModal";

type CreateThreadProps = {
    onSubmit: (values: { title: string; body: string }) => Promise<void> | void;
    disabled?: boolean;
};

export default function CreateThread({ onSubmit, disabled = false }: CreateThreadProps) {
    const [visible, setVisible] = useState(false);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftBody, setDraftBody] = useState("");

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.card,
                    disabled && { opacity: 0.5 },
                    pressed && !disabled && { opacity: 0.7 },
                ]}
                disabled={disabled}
                onPress={() => setVisible(true)}
            >
                <SquaresPlusIcon color="gray" />
                <Text style={styles.text}>Write a thread...</Text>
            </Pressable>

            <ThreadModal
                visible={visible}
                initialTitle={draftTitle}
                initialBody={draftBody}
                onClose={() => setVisible(false)}
                onSubmit={async ({ title, body }) => {
                    await onSubmit({ title, body });
                    setDraftTitle("");
                    setDraftBody("");
                }}
            />
        </>
    );
}
