import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { ChatBubbleOvalLeftIcon } from "react-native-heroicons/outline";
import { styles } from "./styles";
import ReplyModal from "./reply-modal/ReplyModal";

type CreateReplyProps = {
    onSubmit: (text: string) => Promise<void> | void;
    disabled?: boolean;
};

export default function CreateReply({ onSubmit, disabled = false }: CreateReplyProps) {
    const [visible, setVisible] = useState(false);
    const [draft, setDraft] = useState("");

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
                <ChatBubbleOvalLeftIcon color="gray" />
                <Text style={styles.text}>Write a reply...</Text>
            </Pressable>

            <ReplyModal
                visible={visible}
                initialBody={draft}
                onClose={() => setVisible(false)}
                onSubmit={async (body) => {
                    await onSubmit(body);
                    setDraft("");
                }}
            />
        </>
    );
}