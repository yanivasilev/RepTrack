import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    top: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        padding: 8
    },
    cancel: {
        color: "gray"
    },
    title: {
        fontWeight: "900",
        color: "green",
        textTransform: "uppercase"
    },
    save: {
        fontWeight: "700",
        color: "green"
    },
    set: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#F6F6F6"
    },
    setActive: {
        backgroundColor: "#dfdfdf"
    },
    setText: {
        fontSize: 18,
        fontWeight: "900",
        textAlign: "center",
        color: "green"
    }
})