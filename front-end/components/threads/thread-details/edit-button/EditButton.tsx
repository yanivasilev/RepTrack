import { useState } from "react";
import { Pressable } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import EditModal from "./edit-modal/EditModal";

type EditButtonProps = {
    initialTitle?: string;
    initialBody: string;
    maxTitleLength?: number;
    maxBodyLength?: number;
    headerTitle: string;
    onSubmit: (values: { title?: string; body: string }) => Promise<void> | void;
};

export default function EditButton({ initialTitle, initialBody, maxTitleLength, maxBodyLength, headerTitle, onSubmit }: EditButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Pressable onPress={() => setOpen(true)} hitSlop={10}>
                {({ pressed }) => (
                    <PencilSquareIcon size={24} color={pressed ? "darkblue" : "blue"} strokeWidth={2} />
                )}
            </Pressable>

            <EditModal
                visible={open}
                onClose={() => setOpen(false)}
                headerTitle={headerTitle}
                initialTitle={initialTitle}
                initialBody={initialBody}
                requireChange={true}
                requireBody={true}
                onSubmit={onSubmit}
                maxTitleLength={maxTitleLength}
                maxBodyLength={maxBodyLength}
            />
        </>
    );
}