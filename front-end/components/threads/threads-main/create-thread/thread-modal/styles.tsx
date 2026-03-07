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
    headerSideLeft: {
        width: 88,
        alignItems: "flex-start",
    },
    headerSideRight: {
        width: 88,
        alignItems: "flex-end",
    },
    button: {
        padding: 8
    },
    cancel: {
        color: "gray"
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontWeight: "900",
        color: "green",
        textTransform: "uppercase",
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
    },
    inputContainer: {
        flex: 1,
        padding: 16
    },
    titleInput: {
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        marginBottom: 10,
        fontWeight: "700",

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#F6F6F6",
        flexDirection: "column",
        gap: 10,
        marginVertical: 10,

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
    onLoading: {
        opacity: 0.5
    },
    lengthCount: {
        opacity: 0.6,
        color: "gray"
    }
});
