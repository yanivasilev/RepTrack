import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/outline";

type RowProps = {
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
};

export function Row({ title, subtitle, onPress, danger }: RowProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                danger && styles.rowDanger,
            ]}
        >
            <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, danger && styles.dangerText]}>
                    {title}
                </Text>
                {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
            </View>
            <ChevronRightIcon size={24} color="green" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "white"
    },
    rowPressed: {
        backgroundColor: "#f5f5f5"
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "green"
    },
    rowSub: {
        marginTop: 4,
        fontSize: 13,
        color: "gray"
    },
    rowDanger: {},
    dangerText: {
        color: "red"
    },
});