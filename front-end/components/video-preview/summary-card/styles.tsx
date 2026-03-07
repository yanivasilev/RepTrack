import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: "green",
    },
    title: {
        fontWeight: "900",
        color: "green",
        marginBottom: 10
    },
    container: {
        flexDirection: "row",
        gap: 10
    }
})