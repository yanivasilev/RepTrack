import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "green",
        gap: 6,
    },
    button: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonActive: {
        backgroundColor: "green",
    },
    text: {
        color: "green",
        fontWeight: "800",
    },
    textActive: {
        color: "white",
    },
})