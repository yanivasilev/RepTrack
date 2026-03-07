import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

type ReorderSetsModal = {
    visible: boolean;
    title: string;
    sets: any[];
    onClose: () => void;
    onSave: (nextSets: any[]) => void;
}

export default function ReorderSetsModal({ visible, title, sets, onClose, onSave }: ReorderSetsModal) {
    const [localSets, setLocalSets] = useState<any[]>(sets);

    useEffect(() => {
        if (visible) setLocalSets(sets);
    }, [visible, sets]);

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.root}>

                {/* TOP WITH BUTTONS */}
                <View style={styles.top}>
                    <Pressable onPress={onClose} style={styles.button}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>

                    <Pressable onPress={() => onSave(localSets)} style={styles.button}>
                        <Text style={styles.save}>Save</Text>
                    </Pressable>
                </View>

                {/* DRAGGABLE SETS LIST */}
                <DraggableFlatList
                    data={localSets}
                    keyExtractor={(item) => item.id}
                    onDragEnd={({ data }) => setLocalSets(data)}
                    activationDistance={8}
                    autoscrollThreshold={120}
                    autoscrollSpeed={30}
                    contentContainerStyle={{ padding: 16, gap: 10 }}
                    renderItem={({ drag, isActive, getIndex }) => {
                        const index = getIndex?.() ?? 0;

                        return (
                            <Pressable onLongPress={drag} disabled={isActive} style={[styles.set, isActive && styles.setActive]}>
                                <Text style={styles.setText}>SET {index + 1}</Text>
                            </Pressable>
                        );
                    }}
                />
            </SafeAreaView>
        </Modal>
    );
}
