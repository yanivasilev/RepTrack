import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    top: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    sideSlot: {
        width: 72,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        padding: 8
    },
    cancel: {
        color: "gray"
    },
    title: {
        flex: 1,
        fontWeight: "900",
        color: "blue",
        textTransform: "uppercase",
        textAlign: "center",
        flexShrink: 1,
    },
    save: {
        fontWeight: "700",
        color: "blue"
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
        color: "blue"
    },
    inputContainer: {
        flex: 1,
        padding: 16
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        flexDirection: "column",
        gap: 10,
        marginBottom: 10,

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
});
