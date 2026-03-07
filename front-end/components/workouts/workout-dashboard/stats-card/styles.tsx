import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#F6F6F6",
        backgroundColor: "#F6F6F6",
        borderRadius: 14,
        padding: 12,
        gap: 6
    },
    label: {
        color: "gray",
        fontSize: 12
    },
    value: {
        color: "green",
        fontSize: 18,
        fontWeight: "800"
    }
})