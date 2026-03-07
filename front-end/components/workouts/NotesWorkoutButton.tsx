import React, { useState } from "react";
import { Pressable } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import NotesModal from "./../workouts/notes-modal/NotesModal";
import { WorkoutSessionType } from "../../libs/types/workouts/WorkoutSessionType";

type NotesWorkoutButtonProps =
    | {
        mode: "session";
        session: WorkoutSessionType;
        onSave: (next: string) => Promise<void> | void;
        notes?: never;
    }
    | {
        mode: "history";
        notes: string | null | undefined;
        onSave?: never;
        session?: never;
    };

export default function NotesWorkoutButton(props: NotesWorkoutButtonProps) {
    const [visible, setVisible] = useState(false);

    if (props.mode === "history" && props.notes == null) return null;

    const value = props.mode === "session" ? (props.session.notes ?? "") : (props.notes ?? "");

    const handleSave = props.mode === "session" ? async (next: string) => { await props.onSave(next); setVisible(false); } : undefined;

    return (
        <>
            <Pressable
                onPress={() => setVisible(true)}
                style={({ pressed }) => [
                    {
                        position: "absolute",
                        right: 65,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: pressed ? "darkblue" : "blue",
                        backgroundColor: pressed ? "darkblue" : "blue",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                    },
                ]}
                hitSlop={10}
            >
                <PencilSquareIcon size={24} color="white" />
            </Pressable>

            <NotesModal
                visible={visible}
                title="Workout notes"
                value={value}
                onClose={() => setVisible(false)}
                onSave={handleSave}
            />
        </>
    );
}
