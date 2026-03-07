import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    root: {
        flex: 1,
        backgroundColor: "#fff"
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "green",
        fontWeight: "bold"
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: "space-between",
        paddingTop: 10,
    },
    card: {
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderRadius: 16,
        overflow: "hidden",
    },
    dangerText: {
        color: "red"
    },
    footer: {
        paddingTop: 12,
    },
});
