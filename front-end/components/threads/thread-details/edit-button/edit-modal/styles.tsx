import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    root: {
        flex: 1,
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
    saveButton: {
        width: 60,
        alignItems: "center",
        justifyContent: "center"
    },
    cancel: {
        color: "gray"
    },
    title: {
        fontWeight: "900",
        color: "blue",
        textTransform: "uppercase"
    },
    save: {
        fontWeight: "700",
        color: "blue"
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
        marginBottom: 10,

        // IOS SHADOW
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,

        // ANDROID SHADOW
        elevation: 6,
    },
    textLength: {
        marginTop: 8,
        opacity: 0.6,
        color: "gray"
    },
    onLoading: {
        opacity: 0.5
    }
});
